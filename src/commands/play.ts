const { search_platform }: { search_platform: string } = require("../config/settings.json");

import DefaultEmbed from "../models/embed";
import { Command } from "../models/command";
import { abbreviate } from "../utils/functions";
import Song from "../models/song";

import { Message } from "discord.js";

import ytdl from "ytdl-core";
import scdl from "soundcloud-downloader";

import youtube from "../utils/requests/youtube";
import soundcloud from "../utils/requests/soundcloud";

import { Readable } from "node:stream";

const ytRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube.com|youtu\.?be)\/.+$/gi;
const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
const spRegex = /^https?:\/\/(spotify\.com)\/(.*)$/;
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

  public run(msg: Message, args: Array<string>) {
    if (args.length < 1) {
      msg.channel.send("Please enter a link/search entry.");
      return;
    }

    const voice = msg.guild?.voice;

    if (!voice?.connection) {
      msg.member?.voice.channel?.join();
      msg.channel.send(`Successfully joined \`${msg.member?.voice.channel?.name ?? "Unknown channel"}\`.`);
    }

    this.info(msg, args).then((info: Song) => {
      let embed = new DefaultEmbed(msg.author);

      embed.setTitle(info?.title ?? "Unknown song");
      embed.setThumbnail(info?.image);
      embed.setURL(info?.url);

      embed.addFields(
        { name: "Published:", value: info?.date.toLocaleDateString() ?? "Unknown date", inline: true },
        { name: "Author:", value: info?.author, inline: true },
        { name: "Streams:", value: abbreviate(info?.views ?? 0), inline: true }
      );

      if (info?.likes) {
        embed.addField("Likes:", abbreviate(info?.likes ?? 0), true);
      }

      if (info?.dislikes) {
        embed.addField("Dislikes:", abbreviate(info?.dislikes ?? 0), true);
      }

      msg.channel.send("🎵  Now playing:", { embed });

      switch (info.platform) {
        case "youtube":
          this.stream(msg, ytdl(info.url));
          break;
        case "soundcloud":
          scdl.download(info.url).then((stream) => this.stream(msg, stream));
          break;
      }
    });
  }

  private stream(msg: Message, stream: Readable | string) {
    if (msg.guild?.voice?.connection) {
      const connection = msg.guild.voice.connection;

      // let musicStream = typeof stream == "string" ? stream : this.filter(stream);

      connection.play(stream).on("finish", () => {
        msg.guild?.voice?.channel?.leave();
      });
    }
  }

  private async info(msg: Message, args: Array<string>): Promise<Song> {
    let input = args[0];
    if (input.match(ytRegex)) {
      return await youtube.info(input);
    }

    if (input.match(scRegex)) {
      return await soundcloud.info(input);
    }

    if (input.match(spRegex)) {
      // return
    }

    if (input.match(audioPattern)) {
    }

    let search = args.join(" ");

    msg.channel.send(`🔍  Searching for \`${search}\`.`);
    return await this.search(search);
  }

  private filter(inputStream: Readable) {
    // let audioContext = null;
    // if (HasAudioContext) {
    //   audioContext = new AudioContext();
    // }
    // const input = new Input(audioContext);
    // input.input = inputStream;
    // const distortion = new Distortion(audioContext);
    // distortion.intensity = 200;
    // distortion.gain = 100;
    // distortion.lowPassFilter = true;
    // return new Output(audioContext);
  }

  private async search(input: string) {
    switch (search_platform) {
      case "soundcloud":
        let tracks = await soundcloud.search(input, 5);
        let track = tracks.collection[0];

        return await soundcloud.info(track.permalink_url);
      default:
        let video = await youtube.search(input, 1);

        return youtube.info(video?.id ?? "Unknown");
    }
  }
}
