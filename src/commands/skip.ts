import { BotMessage, Command } from "../models";

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

  run(msg: BotMessage, args: Array<string>) {
    let queue = msg.queues.get(msg.guild?.id ?? "");

    let newSong = queue?.songs.shift();
    msg.channel.send("▶️  Successfully skipped the song.");
    this.player.play(msg, newSong);
  }
}
