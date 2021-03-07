import { EmbedField, MessageEmbed, User } from "discord.js-light";
import { chunk } from "../utils/functions";

export class DefaultEmbed extends MessageEmbed {
  constructor(author?: User) {
    super();

    if (author) {
      const avatarURL = author.avatarURL() as string;
      this.setAuthor(`Requested by: ${author.username}`, avatarURL);
    }

    this.setColor("#007AFF");
    this.setTimestamp();
  }
}

export class PaginatedEmbed extends DefaultEmbed {
  page: number;
  constructor({
    author,
    args,
    fields,
  }: {
    author: User;
    args: Array<string>;
    fields: Array<EmbedField | undefined>;
  }) {
    super(author);

    this.page = 1;
    if (fields.length > 0) {
      const chunked = chunk(fields, 5);

      if (args.length > 0) {
        this.page = parseInt(args[0]);
        if (isNaN(this.page) || this.page < 1 || this.page > chunked.length) {
          return;
        }
      }

      this.setFooter(`Page ${this.page}/${chunked.length}`);

      chunked[this.page - 1].forEach((item: EmbedField) =>
        this.addField(item.name, item.value, item.inline)
      );
    }
  }
}
