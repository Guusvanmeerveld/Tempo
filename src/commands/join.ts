import { BotMessage, Command } from "../models";
import { User, VoiceChannel } from "discord.js";

export class Join implements Command {
  name: string;
  aliases: Array<string>;
  voice: boolean;

  constructor() {
    this.name = "join";
    this.aliases = ["j", "summon", "connect"];
    this.voice = true;
  }

  public async run(msg: BotMessage, args: Array<string>) {
    const memberChannel = (await msg.member?.voice.channel?.fetch()) as VoiceChannel;

    if (memberChannel.members.get(msg.client.user?.id ?? "") && msg.guild?.voice?.connection) {
      let guildChannel = (await msg.guild?.voice?.channel?.fetch()) as VoiceChannel;
      msg.channel.send(`🔈  Connected to \`${guildChannel.name}\``);
      return;
    }

    const user = msg.client.user as User;

    let channelPerms = memberChannel?.permissionsFor(user);

    if (!channelPerms?.has("CONNECT")) {
      msg.channel.send("❌  I am not allowed to connect to your voice channel.");
      return;
    }

    if (!channelPerms?.has("SPEAK")) {
      msg.channel.send("❌  I am not allowed to speak in your voice channel.");
      return;
    }

    msg.queues.set(msg.guild?.id ?? "", { songs: [] });

    await memberChannel?.join();

    msg.channel.send(`🔈  Successfully joined \`${memberChannel.name ?? "Unknown channel"}\`.`);
  }
}
