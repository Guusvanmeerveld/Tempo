import { Message } from "discord.js";
import { EmbedField } from "discord.js-light";
import Bot from "../bot";
import { Command, PaginatedEmbed } from "../models";

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
    let queue = client.queues.get(msg.guild?.id ?? "");

    if (!queue?.playing) {
      msg.channel.send("❌  Queue is empty.");
      return;
    }

    let fields: Array<EmbedField> = new Array();
    if (queue.songs.length > 0) {
      queue.songs.forEach((g, i) =>
        fields.push({
          name: `#${i + 1} ${g.title}`,
          value: "Requested by " + g.requested?.toString() ?? "Unknown user",
          inline: false,
        })
      );
    }

    let embed = new PaginatedEmbed({ author: msg.author, args, fields });

    embed.setDescription(
      `Currently playing: \`${queue.playing?.title ?? "Nothing"}\` requested by ${queue.playing.requested?.toString()}`
    );

    embed.setTitle("Songs in the queue");

    msg.channel.send(embed);
  }
}
