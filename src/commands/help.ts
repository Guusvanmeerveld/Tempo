const { prefix } = require(process.cwd() + "/src/config/settings.json");

import { Command, DefaultEmbed } from "../models";
import { Message } from "discord.js";
import Bot from "../bot";
import { chunk } from "../utils/functions";

export class Help implements Command {
  name: string;
  aliases: Array<string>;
  description: string;

  constructor() {
    this.name = "help";
    this.aliases = ["h"];
    this.description = "Get information about a specific command or just a general list of commands.";
  }

  public run(msg: Message, args: Array<string>, client: Bot) {
    let page: number = 1;

    let commands = chunk(client.commands.array(), 5);

    if (args.length > 0) {
      page = parseInt(args[0]);

      if (isNaN(page) || page > commands.length || page < 0) {
        msg.channel.send("❌  That is not a valid page number.");
        return;
      }
    }

    let embed = new DefaultEmbed(msg.author);

    embed.setTitle("List of commands for Tempo:");
    embed.setFooter(`Page ${page}/${commands.length}`);

    commands[page - 1].forEach((cmd: Command) => {
      embed.addField(
        `\`${prefix + cmd.name}\``,
        `${cmd.description}${cmd.aliases ? `\nAliases: \`${cmd.aliases?.join(", ")}\`` : ""}`
      );
    });

    msg.channel.send(embed);
  }
}
