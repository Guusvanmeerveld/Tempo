const { search_platform }: { search_platform: string } = require("../config/settings.json");

import DefaultEmbed from "@models/embed";
import { Command } from "@models/command";
import Song from "@models/song";

import { Message } from "discord.js";

import youtube from "../utils/requests/youtube";

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

    this.info(args[0]).then((info: Song) => {
      let embed = new DefaultEmbed(msg.author);

      embed.setTitle(info?.title ?? "No title");
      embed.setThumbnail(info?.image);

      embed.addFields({ name: "Published", value: info?.date ?? "Unknown" });

      msg.channel.send(embed);
    });
  }

  private async info(input: string): Promise<Song> {
    if (input.match(ytRegex)) {
      return await youtube.info(input);
    }

    if (input.match(scRegex)) {
      // return
    }

    if (input.match(spRegex)) {
      // return
    }

    if (input.match(audioPattern)) {
      // return
    }

    return await this.search(input);
  }

  private stream() {}

  private async search(input: string) {
    switch (search_platform) {
      default:
        let video = await youtube.search(input, 1);

        return youtube.info(video.id);
    }
  }
}
