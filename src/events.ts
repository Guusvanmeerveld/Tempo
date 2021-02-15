import { Collection, Guild, Message, TextChannel, User } from "discord.js";
import { Command } from "./models/command";
const { prefix } = require("./config/settings.json");

import { Disconnect, Help, Join, Play } from "./commands";

export class HandleMessage {
  public commands: Collection<string, Command>;
  constructor() {
    this.commands = new Collection();

    this.listCommands();
  }

  handle(msg: Message) {
    if (msg.partial || msg.system || msg.author.id === msg.client.user!.id || msg.author.bot || !msg.guild) {
      return;
    }

    if (!msg.content.startsWith(prefix)) {
      return;
    }

    const channel = msg.channel as TextChannel;
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

    command.run(msg, args);
  }

  listCommands() {
    this.commands.set("help", new Help());
    this.commands.set("join", new Join());
    this.commands.set("disconnect", new Disconnect());
    this.commands.set("play", new Play());
  }
}

export function handleGuildJoin(guild: Guild) {}
