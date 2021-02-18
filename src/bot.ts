import { Client, Collection } from "discord.js-light";
import { Queue } from "./models";
import Console from "./utils/console";
import lang from "./utils/language";

export default class Bot extends Client {
  queues: Collection<string, Queue>;
  constructor() {
    super({
      cacheGuilds: true,
      cacheChannels: false,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: false,
      cachePresences: false,
    });

    this.queues = new Collection();
  }

  public start(token: string) {
    console.time();
    Console.info("Connecting with Discord");

    this.on("ready", () => {
      this.user!.setActivity(lang.bot.activity.text ?? "", { type: lang.bot.activity.type ?? "PLAYING" });
    });

    this.login(token)
      .then(() => Console.success("Successfully connected with Discord!"))
      .catch(() => Console.error("Failed to connect with Discord!"))
      .finally(console.timeEnd);
  }
}
