import { Message } from 'discord.js-light';

import { Command, Requirement } from '@models/command';
import { Setting } from '@models/settings';
import Bot from '../bot';

import { maxVolume } from '@config/global.json';

export class Volume implements Command {
	name = 'volume';
	description = 'Set the bots volume.';
	usage = 'volume [new volume]%';
	aliases = ['v', 'vol'];
	requirements: Requirement[] = ['ROLE'];

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	run(msg: Message, args: Array<string>): void {
		const volume = parseInt(args[0]?.replace('%', ''));

		if (isNaN(volume) || volume < 0 || volume > maxVolume) {
			msg.channel.send(
				`❌  That is not a valid number. Please specify a number between 0 - ${maxVolume}.`
			);
			return;
		}

		if (!volume) {
			const settings = this.client.settings.get(msg.guild?.id);

			msg.channel.send(`The volume is set to ${settings.volume}%`);
		}

		const dispatcher = msg.guild?.voice?.connection?.dispatcher;

		if (dispatcher) {
			dispatcher.setVolume(volume / 100);
		}

		this.client.settings.set(msg.guild?.id ?? '', Setting.Volume, volume);
		msg.channel.send(`🔊  Set the volume to \`${volume}%\``);
	}
}
