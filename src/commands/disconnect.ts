import { Message, VoiceChannel } from 'discord.js-light';

import { Command, Requirement } from '@models/index';
import Bot from 'bot';

export class Disconnect implements Command {
	name = 'disconnect';
	aliases = ['dis', 'd', 'l', 'leave'];
	description = 'Disconnect the bot from the voice channel.';
	usage = 'disconnect';
	requirements: Requirement[] = ['VOICE', 'ROLE'];

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	public async run(msg: Message): Promise<void> {
		const voice = msg.guild?.voice;
		const channel = (await voice?.channel?.fetch()) as VoiceChannel;

		const lang = this.client.locales.get(msg.guild);

		if (!channel) {
			msg.channel.send(`❌  ${lang.voice.notConnected}`);
			return;
		}

		msg.channel.send(`🔈  ${lang.voice.disconnected.replace('{channelName}', channel?.name)}`);
		voice?.channel?.leave();
	}
}
