import { Message } from "discord.js-light";
import Bot from "../bot";

export interface Command {
  name: string;
  description?: string;
  usage?: string;
  aliases?: Array<string>;
  voice?: boolean;
  run: (msg: Message, args: Array<string>, client: Bot) => void;
}
