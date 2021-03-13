import { Message } from 'discord.js-light';
import Bot from '../bot';
import { Command, Requirement, Setting } from '../models';

export const MAX_VOLUME = 1000;

export class Volume implements Command {
	name: string;
	aliases: Array<string>;
	requirements: Array<Requirement>;
	description: string;

	constructor() {
		this.name = 'volume';
		this.aliases = ['v', 'vol'];
		this.requirements = ['ROLE'];
		this.description = 'Set the bots volume.';
	}

	run(msg: Message, args: Array<string>, client: Bot) {
		const volume = parseInt(args[0]?.replace('%', ''));

		if (isNaN(volume) || volume < 0 || volume > MAX_VOLUME) {
			msg.channel.send(
				`❌  That is not a valid number. Please specify a number between 0 - ${MAX_VOLUME}.`
			);
			return;
		}

		if (!volume) {
			const settings = client.settings.get(msg.guild!.id);

			msg.channel.send(`The volume is set to ${settings.volume}%`);
		}

		if (msg.guild?.voice?.connection?.dispatcher) {
			msg.guild.voice.connection.dispatcher.setVolume(volume / 100);
		}

		client.settings.set(msg.guild!.id, Setting.Volume, volume);
		msg.channel.send(`🔈  Set the volume to \`${volume}%\``);
	}
}
