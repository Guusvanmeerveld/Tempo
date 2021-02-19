import { Message } from "discord.js-light";
import { Command } from "../models";

export class Stop implements Command {
  name: string;
  description: string;

  constructor() {
    this.name = "stop";
    this.description = "Stop the music.";
  }

  run(msg: Message) {}
}
