import { Command, Requirement } from '@models/index';
import { Message, VoiceChannel } from 'discord.js-light';

export class Disconnect implements Command {
	name = 'disconnect';
	aliases = ['dis', 'd', 'l', 'leave'];
	description = 'Disconnect the bot from the voice channel.';
	usage = 'disconnect';
	requirements: Requirement[] = ['VOICE', 'ROLE'];

	public async run(msg: Message) {
		const voice = msg.guild?.voice;
		const channel = (await voice?.channel?.fetch()) as VoiceChannel;

		if (!channel) {
			msg.channel.send("❌  I'm not connected to a voice channel.");
			return;
		}

		msg.channel.send(`🔈  Successfully disconnected from \`${channel?.name}\`.`);
		voice?.channel?.leave();
	}
}
