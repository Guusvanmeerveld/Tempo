import { Message } from 'discord.js-light';
import { Command, Requirement } from '../models';

export class Stop implements Command {
	name: string;
	description: string;
	requirements: Array<Requirement>;
	aliases: Array<string>;

	constructor() {
		this.name = 'stop';
		this.description = 'Stop the music.';
		this.requirements = ['VOICE'];
		this.aliases = ['st'];
	}

	run(msg: Message) {
		const connection = msg.guild?.voice?.connection;

		if (!connection) {
			msg.channel.send("❌  I'm not connected to a voice channel.");
			return;
		}

		const dispatcher = connection?.dispatcher;

		if (!dispatcher) {
			msg.channel.send('There is nothing playing right now.');
			return;
		}

		if (dispatcher.paused) {
			msg.channel.send('Already stopped.');
			return;
		}

		dispatcher.pause();
		msg.channel.send('Stopped the music.');
	}
}
