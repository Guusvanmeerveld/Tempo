import { Collection, Guild, Message, TextChannel, User } from "discord.js-light";

import { Command, Queue } from "./models";
import { Disconnect, Help, Join, Play, Ping, Volume, Uptime, Skip } from "./commands";
import Bot from "./bot";

const { prefix } = require(process.cwd() + "/src/config/settings.json");

export class HandleMessage {
  public commands: Collection<string, Command>;
  private queues: Collection<string, Queue>;
  constructor() {
    this.commands = new Collection();

    this.listCommands();
    this.queues = new Collection();
  }

  public async handle(msg: Message, client: Bot) {
    if (msg.partial || msg.system || msg.author.id === msg.client.user!.id || msg.author.bot || !msg.guild) {
      return;
    }

    if (!msg.content.startsWith(prefix)) {
      return;
    }

    const channel = (await msg.channel.fetch()) as TextChannel;
    const user = msg.client.user as User;

    let channelPerms = channel.permissionsFor(user);

    if (!channelPerms?.has("SEND_MESSAGES") || !channelPerms?.has("EMBED_LINKS")) {
      return;
    }

    const args: Array<string> = msg.content.slice(prefix.length).split(/ +/);
    const commandInput: string = args.shift()!.toLowerCase();

    const command =
      this.commands.get(commandInput) || this.commands.find((cmd) => cmd.aliases?.includes(commandInput) ?? false);

    if (!command) return;

    if (command.voice && !msg.member?.voice.channel) {
      msg.channel.send("You need to be connected to a voice channel to use this command.");
      return;
    }

    command.run(msg, args, client);
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
  }
}

export function handleGuildJoin(guild: Guild) {}
