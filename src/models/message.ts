import { Collection, Message } from "discord.js";
import { Queue } from "./queue";

export interface BotMessage extends Message {
  queues: Collection<string, Queue>;
}
