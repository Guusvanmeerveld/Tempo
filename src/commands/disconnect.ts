import { BotMessage, Command } from "../models";
import { VoiceChannel } from "discord.js";

export class Disconnect implements Command {
  name: string;
  aliases: Array<string>;
  voice: boolean;

  constructor() {
    this.name = "disconnect";
    this.aliases = ["dis", "d", "l", "leave"];
    this.voice = true;
  }

  public async run(msg: BotMessage, args: Array<string>) {
    const voice = msg.guild?.voice;
    const channel = (await voice?.channel?.fetch()) as VoiceChannel;

    if (!channel) {
      msg.channel.send("❌  I'm not connected to a voice channel.");
      return;
    }

    msg.channel.send(`🔈  Successfully disconnected from \`${channel?.name}\`.`);
    voice?.connection?.disconnect();
  }
}
