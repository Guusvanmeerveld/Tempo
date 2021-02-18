import { Command } from "../models";

import humanizeDuration from "humanize-duration";
import { Message } from "discord.js";

export class Uptime implements Command {
  name: string;
  aliases: Array<string>;
  description: string;

  constructor() {
    this.name = "uptime";
    this.aliases = ["up"];
    this.description = "Get the uptime of the bot.";
  }

  run(msg: Message) {
    let time = humanizeDuration(msg.client.uptime ?? 0);
    msg.channel.send(`I've been online for ${time}.`);
  }
}
