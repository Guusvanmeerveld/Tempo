const { search_platform }: { search_platform: string } = require("../config/settings.json");

import DefaultEmbed from "../models/embed";
import { Command } from "../models/command";
import { abbreviate, ucFirst } from "../utils/functions";
import Song from "../models/song";

import { Join } from "./join";

const join = new Join().run;

import ytdl from "ytdl-core";
import scdl from "soundcloud-downloader";

import youtube from "../utils/requests/youtube";
import soundcloud from "../utils/requests/soundcloud";
import Spotify from "../utils/requests/spotify";

let spotify = new Spotify();

import { Readable } from "node:stream";
import { BotMessage } from "../models/message";
import { Queue } from "../models/queue";
import Console from "../utils/console";
import { Video } from "ytsr";

const ytRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube.com|youtu\.?be)\/.+$/gi;
const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
const spRegex = /^https?:\/\/(open\.spotify\.com\/track)\/(.*)$/;
const audioPattern = /\.(?:wav|mp3)$/i;

export class Play implements Command {
  name: string;
  aliases: Array<string>;
  voice: boolean;

  constructor() {
    this.name = "play";
    this.aliases = ["p"];
    this.voice = true;
  }

  public async run(msg: BotMessage, args: Array<string>) {
    if (args.length < 1) {
      msg.channel.send("Please enter a link/search entry.");
      return;
    }

    await join(msg, args);

    let queue = msg.queues.get(msg.guild?.id ?? "") as Queue;

    this.info(msg, args)
      .then((info: Song) => {
        let embed = new DefaultEmbed(msg.author);

        embed.setTitle(info?.title ?? "Unknown song");
        embed.setThumbnail(info?.image);
        embed.setURL(info?.url);

        embed.addFields(
          { name: "Published", value: info?.date.toLocaleDateString() ?? "Unknown date", inline: true },
          { name: "Author", value: info?.author, inline: true },
          { name: "Platform", value: ucFirst(info.platform), inline: true },
          { name: "Streams", value: abbreviate(info?.views ?? 0), inline: true }
        );

        if (info?.likes) {
          embed.addField("Likes", abbreviate(info?.likes ?? 0), true);
        }

        if (info?.dislikes) {
          embed.addField("Dislikes", abbreviate(info?.dislikes ?? 0), true);
        }

        if (queue?.playing) {
          queue.songs.push(info);
          msg.channel.send(`🎵  Added \`${info.title}\` to the queue.`, { embed });

          return;
        }

        queue.playing = info;

        msg.channel.send("🎵  Now playing:", { embed });

        this.play(msg, info);
      })
      .catch((error) => {
        Console.error(error);

        msg.channel.send("❌  " + error);
        msg.guild?.voice?.channel?.leave();
      });
  }

  public play(msg: BotMessage, song: Song | undefined) {
    if (!song) {
      msg.guild?.voice?.channel?.leave();
      return;
    }

    switch (song.platform) {
      case "youtube":
        this.stream(msg, ytdl(song.url, { filter: "audioonly" }));
        break;
      case "soundcloud":
        scdl.download(song.url).then((stream) => this.stream(msg, stream));
        break;
    }
  }

  private stream(msg: BotMessage, stream: Readable | string) {
    if (msg.guild?.voice?.connection) {
      const connection = msg.guild.voice.connection;

      // let musicStream = typeof stream == "string" ? stream : this.filter(stream);

      connection.play(stream).on("finish", () => {
        let queue = msg.queues.get(msg.guild?.id ?? "") as Queue;

        if (queue.songs.length > 0) {
          let newSong = queue.songs.shift() as Song;

          queue.playing = newSong;
          this.play(msg, newSong);

          return;
        }

        msg.guild?.voice?.channel?.leave();
      });
    }
  }

  private async info(msg: BotMessage, args: Array<string>): Promise<Song> {
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

  private filter(inputStream: Readable) {}

  private async search(input: string): Promise<Song> {
    switch (search_platform) {
      case "soundcloud":
        let tracks = await soundcloud.search(input, 1);

        if (tracks.collection.length < 1) {
          throw "I was not able to find that song on Soundcloud.";
        }

        let track = tracks.collection[0];

        return await soundcloud.info(track.permalink_url);
      case "spotify":
        let songs = (await spotify.search(input, 1)).tracks;

        if (songs.items.length < 1) {
          throw "I was not able to find that song on Spotify.";
        }

        let song = songs.items[0];

        return spotify.info(song.id);
      default:
        let videos = await youtube.search(input, 1);

        if (videos.items.length < 1) {
          throw "I was not able to find that song on Youtube.";
        }

        let video = videos.items[0] as Video;

        return youtube.info(video?.id ?? "Unknown");
    }
  }
}
