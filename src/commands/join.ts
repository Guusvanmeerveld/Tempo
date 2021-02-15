import { Message, User } from "discord.js";
import { Command } from "../models/command";

export class Join implements Command {
  name: string;
  aliases: Array<string>;
  voice: boolean;

  constructor() {
    this.name = "join";
    this.aliases = ["j", "summon", "connect"];
    this.voice = true;
  }

  public run(msg: Message, args: Array<string>) {
    if (msg.member?.voice.channel?.members.get(msg.client.user?.id ?? "")) {
      msg.channel.send(`Connected to \`${msg.guild?.voice?.channel?.name}\``);
      return;
    }

    const channel = msg.member?.voice.channel;
    const user = msg.client.user as User;

    let channelPerms = channel?.permissionsFor(user);

    if (!channelPerms?.has("CONNECT")) {
      msg.channel.send("I am not allowed to connect to your voice channel.");
      return;
    }

    if (!channelPerms?.has("SPEAK")) {
      msg.channel.send("I am not allowed to speak in your voice channel.");
      return;
    }

    channel?.join().then(() => {
      msg.channel.send(`Successfully joined \`${channel.name ?? "Unknown channel"}\`.`);
    });
  }
}
