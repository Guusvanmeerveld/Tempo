import { Message } from "discord.js-light";
import Bot from "../bot";
import { Command } from "../models";

import { Play } from "./play";

export class Skip implements Command {
  name: string;
  aliases: Array<string>;
  player: Play;
  description: string;

  constructor() {
    this.player = new Play();
    this.name = "skip";
    this.aliases = ["s"];
    this.description = "Skip the current song.";
  }

  run(msg: Message, args: Array<string>, client: Bot) {
    if (!msg.guild.voice?.connection) {
      msg.channel.send("❌  I'm not connected to a voice channel.");
      return;
    }

    let queue = client.queues.get(msg.guild?.id ?? "");

    if (!queue.playing) {
      msg.channel.send("❌  There is nothing playing right now.");
      return;
    }

    let count = 1;

    if (args.length > 0) {
      count = parseInt(args[0]);

      if (queue.songs.length < count - 1 || count < 1) {
        msg.channel.send(
          `That is not a valid number of songs to skip. Please specify a number between 1 - ${queue.songs.length + 1}`
        );
        return;
      }
    }

    msg.channel.send("✅  Successfully skipped the song.");
    this.player.play(msg, client, queue.songs[count - 1]);
    queue?.songs.splice(0, count);
  }
}
