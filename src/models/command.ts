import { BotMessage } from "./message";

export interface Command {
  name: string;
  description?: string;
  usage?: string;
  aliases?: Array<string>;
  voice?: boolean;
  run: (msg: BotMessage, args: Array<string>) => void;
}
