import { Client } from "discord.js";
import Console from "./utils/console";
import lang from "./utils/language";

export default class Bot extends Client {
  constructor() {
    super();
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
