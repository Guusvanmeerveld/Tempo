import { Command } from "../models/command";
import { BotMessage } from "../models/message";

import humanizeDuration from "humanize-duration";

export class Uptime implements Command {
  name: string;
  aliases: Array<string>;
  constructor() {
    this.name = "uptime";
    this.aliases = ["up"];
  }

  run(msg: BotMessage, args: Array<string>) {
    let time = humanizeDuration(msg.client.uptime ?? 0);
    msg.channel.send(`I've been online for ${time}.`);
  }
}
