import { Message } from "discord.js-light";
import Bot from "../bot";
import { Command } from "../models";

import { Play } from "./play";

export class Skip implements Command {
  name: string;
  aliases: Array<string>;
  player: Play;
  constructor() {
    this.player = new Play();
    this.name = "skip";
    this.aliases = ["s"];
  }

  run(msg: Message, args: Array<string>, client: Bot) {
    let queue = client.queues.get(msg.guild?.id ?? "");

    let newSong = queue?.songs.shift();
    msg.channel.send("▶️  Successfully skipped the song.");
    this.player.play(msg, client, newSong);
  }
}
