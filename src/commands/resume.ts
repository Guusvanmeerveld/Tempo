import { Message } from 'discord.js-light';
import { Command, Requirement } from '../models';

export class Resume implements Command {
	name = 'resume';
	description = 'Resume the music.';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	aliases = ['re'];

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

		if (!dispatcher.paused) {
			msg.channel.send('Already resumed.');
			return;
		}

		dispatcher.resume();
		msg.channel.send('Resumed the music.');
	}
}
