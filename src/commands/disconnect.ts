import { Message } from "discord.js";
import { Command } from "../models/command";

export class Disconnect implements Command {
  name: string;
  aliases: Array<string>;
  voice: boolean;

  constructor() {
    this.name = "disconnect";
    this.aliases = ["dis", "d", "l", "leave"];
    this.voice = true;
  }

  public run(msg: Message, args: Array<string>) {
    const voice = msg.guild?.voice;

    if (!voice?.channel) {
      msg.channel.send("I'm not connected to a voice channel.");
      return;
    }

    msg.channel.send(`Successfully disconnected from \`${voice.channel?.name}\`.`);
    voice.channel.leave();
  }
}
