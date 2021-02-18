import { BotMessage } from "../models/message";
import { Command } from "../models/command";

export class Ping implements Command {
  name: string;

  constructor() {
    this.name = "ping";
  }

  run(msg: BotMessage, args: Array<string>) {
    msg.channel.send(`💤  Pinging...`).then((sent) => {
      sent.edit(`🏓  Pong! Took ${sent.createdTimestamp - msg.createdTimestamp}ms`);
    });
  }
}
