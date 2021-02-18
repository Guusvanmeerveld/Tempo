const { prefix } = require("../config/settings.json");

import { Command } from "../models/command";
import DefaultEmbed from "../models/embed";
import getCommands from "../utils/requests/commands";
import { chunk } from "../utils/functions";
import { BotMessage } from "../models/message";

export class Help implements Command {
  name: string;
  aliases: Array<string>;
  commands: Array<Array<Command>>;

  constructor() {
    (this.name = "help"), (this.aliases = ["h"]), (this.commands = chunk(getCommands(), 5));
  }

  public run(msg: BotMessage, args: Array<string>) {
    let page: number = 1;

    if (args.length > 0) {
      page = parseInt(args[0]);

      if (isNaN(page) || page > this.commands.length || page < 0) {
        msg.channel.send("❌  That is not a valid page number.");
        return;
      }
    }

    let embed = new DefaultEmbed(msg.author);

    embed.setTitle("List of commands for Tempo:");
    embed.setFooter(`Page ${page}/${this.commands.length}`);

    this.commands[page - 1].forEach((cmd: Command) => {
      embed.addField(`\`${prefix + cmd.name}\``, `${cmd.description}\n Aliases: \`${cmd.aliases?.join(", ")}\``);
    });

    msg.channel.send(embed);
  }
}
