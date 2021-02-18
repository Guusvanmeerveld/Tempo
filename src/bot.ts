import { Client, Collection } from "discord.js-light";
import { QueueList, Command } from "./models";
import Console from "./utils/console";
import lang from "./utils/language";

import { Disconnect, Help, Join, Play, Ping, Volume, Uptime, Skip, Queue } from "./commands";

export default class Bot extends Client {
  public commands: Collection<string, Command>;
  public queues: Collection<string, QueueList>;
  constructor() {
    super({
      cacheGuilds: true,
      cacheChannels: false,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: false,
      cachePresences: false,
    });

    this.commands = new Collection();
    this.queues = new Collection();

    this.listCommands();
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

  private listCommands() {
    this.commands.set("help", new Help());
    this.commands.set("join", new Join());
    this.commands.set("disconnect", new Disconnect());
    this.commands.set("play", new Play());
    this.commands.set("ping", new Ping());
    this.commands.set("volume", new Volume());
    this.commands.set("uptime", new Uptime());
    this.commands.set("skip", new Skip());
    this.commands.set("queue", new Queue());
  }
}
