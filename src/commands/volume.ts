import { Message } from "discord.js-light";
import { Command } from "../models";

const MAX_VOLUME = 1000;

export class Volume implements Command {
  name: string;
  aliases: Array<string>;
  voice: boolean;

  constructor() {
    this.name = "volume";
    this.aliases = ["v", "vol"];
    this.voice = true;
  }

  run(msg: Message, args: Array<string>) {
    let volume = parseInt(args[0].replace("%", ""));

    if (isNaN(volume) || volume < 0 || volume > MAX_VOLUME) {
      msg.channel.send(`❌  That is not a valid number. Please specify a number between 0 - ${MAX_VOLUME}.`);
      return;
    }

    if (msg.guild?.voice?.connection) {
      msg.guild.voice.connection.dispatcher.setVolume(volume / 100);
      msg.channel.send(`🔈  Set the volume to \`${volume}%\``);
    }
  }
}
