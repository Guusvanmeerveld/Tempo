import { Command } from "../models";
import { Message, VoiceChannel } from "discord.js-light";

export class Disconnect implements Command {
  name: string;
  aliases: Array<string>;
  description: string;
  voice: boolean;

  constructor() {
    this.name = "disconnect";
    this.aliases = ["dis", "d", "l", "leave"];
    this.voice = true;
    this.description = "Disconnect the bot from the voice channel.";
  }

  public async run(msg: Message) {
    const voice = msg.guild?.voice;
    const channel = (await voice?.channel?.fetch()) as VoiceChannel;

    if (!channel) {
      msg.channel.send("❌  I'm not connected to a voice channel.");
      return;
    }

    // client.queues.set(msg.guild?.id ?? "", { songs: [] });

    msg.channel.send(`🔈  Successfully disconnected from \`${channel?.name}\`.`);
    voice?.connection?.disconnect();
  }
}
