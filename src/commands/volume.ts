import { Message } from 'discord.js-light';
import { Command, Requirement } from '../models';

export const MAX_VOLUME = 1000;

export class Volume implements Command {
	name: string;
	aliases: Array<string>;
	requirements: Array<Requirement>;
	description: string;

	constructor() {
		this.name = 'volume';
		this.aliases = ['v', 'vol'];
		this.requirements = ['VOICE', 'ROLE'];
		this.description = 'Set the bots volume.';
	}

	run(msg: Message, args: Array<string>) {
		const volume = parseInt(args[0]?.replace('%', ''));

		if (msg.guild?.voice?.connection?.dispatcher) {
			if (!volume) {
				msg.channel.send(
					`The volume is set to ${msg.guild.voice.connection.dispatcher.volume}%`
				);
			}

			if (isNaN(volume) || volume < 0 || volume > MAX_VOLUME) {
				msg.channel.send(
					`❌  That is not a valid number. Please specify a number between 0 - ${MAX_VOLUME}.`
				);
				return;
			}

			msg.guild.voice.connection.dispatcher.setVolume(volume / 100);
			msg.channel.send(`🔈  Set the volume to \`${volume}%\``);
		}
	}
}
