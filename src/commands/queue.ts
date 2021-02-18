import { Message } from "discord.js";
import Bot from "../bot";
import { Command, DefaultEmbed } from "../models";

export class Queue implements Command {
  name: string;
  aliases: Array<string>;
  description: string;

  constructor() {
    this.name = "queue";
    this.aliases = ["q"];
    this.description = "Gives a list of all the songs currently in the queue.";
  }

  run(msg: Message, args: Array<string>, client: Bot) {
    let queue = client.queues.get(msg.guild.id);

    console.log(queue);

    if (!queue?.playing) {
      msg.channel.send("❌  Queue is empty.");
      return;
    }

    let embed = new DefaultEmbed(msg.author);

    msg.channel.send(embed);
  }
}
