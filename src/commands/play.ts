const { search_platform } = require(process.cwd() + "/src/config/settings.json");
import { Command, Song, DefaultEmbed, Requirement } from "../models";

import Console from "../utils/console";
import { abbreviate, ucFirst } from "../utils/functions";

import youtube from "../utils/requests/youtube";

import soundcloud from "../utils/requests/soundcloud";
import Spotify from "../utils/requests/spotify";

let spotify = new Spotify();

import { Join } from "./join";
const join = new Join().run;

import ytdl from "ytdl-core";

import { Readable } from "node:stream";
import { Video } from "ytsr";
import { Message } from "discord.js";
import Bot from "../bot";

const ytRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube.com|youtu\.?be)\/.+$/gi;
const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
const spRegex = /^https?:\/\/(open\.spotify\.com\/track)\/(.*)$/;
const audioPattern = /\.(?:wav|mp3)$/i;

export class Play implements Command {
  public name: string;
  public aliases: Array<string>;
  public requirements: Array<Requirement>;
  public description: string;

  constructor() {
    this.name = "play";
    this.aliases = ["p"];
    this.requirements = ["VOICE", "ROLE"];
    this.description = "Play a song via a link or a search request.";
  }

  /**
   * Join the voice channel, get info about the song and play it.
   * @param msg
   * @param args
   * @param client
   */
  public async run(msg: Message, args: Array<string>, client: Bot) {
    if (args.length < 1) {
      msg.channel.send("Please enter a link/search entry.");
      return;
    }

    await join(msg, args, client);

    let queue = client.queues.get(msg.guild?.id ?? "");

    this.info(msg, args)
      .then((info: Song) => {
        let song: Song = { requested: msg.author, ...info };
        let embed = new DefaultEmbed(msg.author);

        embed.setTitle(song?.title ?? "Unknown song");
        embed.setThumbnail(song?.image);
        embed.setURL(song?.url);

        embed.addFields(
          { name: "Published", value: song?.date.toLocaleDateString() ?? "Unknown date", inline: true },
          { name: "Author", value: song?.author, inline: true },
          { name: "Platform", value: ucFirst(song.platform), inline: true },
          { name: "Streams", value: abbreviate(song?.views ?? 0), inline: true }
        );

        if (song?.likes) {
          embed.addField("Likes", abbreviate(song?.likes ?? 0), true);
        }

        if (song?.dislikes) {
          embed.addField("Dislikes", abbreviate(song?.dislikes ?? 0), true);
        }

        if (queue?.playing) {
          queue.songs.push(song);
          msg.channel.send(`🎵  Added \`${song.title}\` to the queue.`, { embed });

          return;
        }

        msg.channel.send("🎵  Now playing:", { embed });

        this.play(msg, client, song);
      })
      .catch((error) => {
        Console.error(error);

        msg.channel.send("❌  " + error);
      });
  }

  /**
   * Determine the platform and stream the song.
   * @param msg
   * @param client
   * @param song
   */
  public play(msg: Message, client: Bot, song: Song | undefined) {
    if (!song) {
      msg.guild?.voice?.channel?.leave();
      return;
    }

    let queue = client.queues.get(msg.guild?.id ?? "");
    if (!queue) return;

    queue.playing = song;

    switch (song.platform) {
      case "youtube":
        this.stream(msg, client, ytdl(song.url, { filter: "audioonly" }));
        break;
      case "soundcloud":
        soundcloud.download(song.download).then((stream) => this.stream(msg, client, stream));
        break;
    }
  }

  /**
   * Stream the song to the voice channel
   * @param msg
   * @param client
   * @param stream
   */
  private stream(msg: Message, client: Bot, stream: Readable | string) {
    if (msg.guild?.voice?.connection) {
      const connection = msg.guild.voice.connection;

      connection.play(stream).on("finish", () => {
        let queue = client.queues.get(msg.guild?.id ?? "");

        if (!queue) return;

        if (queue.songs.length > 0) {
          let newSong = queue.songs.shift() as Song;

          queue.playing = newSong;
          this.play(msg, client, newSong);

          return;
        }

        msg.guild?.voice?.channel?.leave();
      });
    }
  }

  /**
   * Get info about a certain user input.
   * @param msg
   * @param args
   */
  private async info(msg: Message, args: Array<string>): Promise<Song> {
    let input = args[0];
    if (input.match(ytRegex)) {
      return await youtube.info(input);
    }

    if (input.match(scRegex)) {
      return await soundcloud.info(input);
    }

    if (input.match(spRegex)) {
      return await spotify.info(input);
    }

    if (input.match(audioPattern)) {
    }

    let search = args.join(" ");

    msg.channel.send(`🔍  Searching for \`${search}\`.`);
    return await this.search(search);
  }

  /**
   * Search on a given platform for a user input
   * @param input
   */
  private async search(input: string): Promise<Song> {
    let notFound = (platform: string) => `I was not able to find \`${input}\` on ${platform}.`;
    switch (search_platform) {
      case "soundcloud":
        let tracks = await soundcloud.search(input, 1);

        if (tracks.collection.length < 1) {
          throw notFound("Soundcloud");
        }

        let track = tracks.collection[0];

        return await soundcloud.info(track.permalink_url);
      case "spotify":
        let songs = (await spotify.search(input, 1)).tracks;

        if (songs.items.length < 1) {
          throw notFound("Spotify");
        }

        let song = songs.items[0];

        return spotify.info(song.id);
      default:
        let videos = await youtube.search(input, 1);

        if (videos.items.length < 1) {
          throw notFound("Youtube");
        }

        let video = videos.items[0] as Video;

        return youtube.info(video?.id ?? "Unknown");
    }
  }
}
