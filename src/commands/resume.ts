import { Message } from 'discord.js-light';
import { Command, Requirement } from '../models';

export class Resume implements Command {
	name: string;
	description: string;
	requirements: Array<Requirement>;
	aliases: Array<string>;

	constructor() {
		this.name = 'resume';
		this.description = 'Resume the music.';
		this.requirements = ['VOICE'];
		this.aliases = ['re'];
	}

	run(msg: Message) {
		const dispatcher = msg.guild?.voice?.connection?.dispatcher;

		if (!dispatcher) {
			msg.channel.send("❌  I'm not connected to a voice channel.");
			return;
		}

		if (!dispatcher.paused) {
			msg.channel.send('Already resumed.');
			return;
		}

		dispatcher.resume();
		msg.channel.send('Resumed the music.');
	}
}
