import { MessageEmbed, User } from "discord.js";

export class DefaultEmbed extends MessageEmbed {
  constructor(author: User) {
    super();

    let avatarURL = author.avatarURL() as string;

    this.setColor("#007AFF");
    this.setAuthor(`Requested by: ${author.username}`, avatarURL);
    this.setTimestamp();
  }
}
