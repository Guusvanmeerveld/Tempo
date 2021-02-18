import { Command } from "../models";

import humanizeDuration from "humanize-duration";
import { Message } from "discord.js";

export class Uptime implements Command {
  name: string;
  aliases: Array<string>;
  constructor() {
    this.name = "uptime";
    this.aliases = ["up"];
  }

  run(msg: Message, args: Array<string>) {
    let time = humanizeDuration(msg.client.uptime ?? 0);
    msg.channel.send(`I've been online for ${time}.`);
  }
}
