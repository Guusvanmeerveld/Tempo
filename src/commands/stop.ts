import { Message } from 'discord.js-light';
import { Command, Requirement } from '../models';

export class Stop implements Command {
	name = 'stop';
	description = 'Stop the music.';
	usage = 'stop';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	aliases = ['st'];

	run(msg: Message) {
		const connection = msg.guild?.voice?.connection;

		if (!connection) {
			msg.channel.send("❌  I'm not connected to a voice channel.");
			return;
		}

		const dispatcher = connection?.dispatcher;

		if (!dispatcher) {
			msg.channel.send('❌  There is nothing playing right now.');
			return;
		}

		if (dispatcher.paused) {
			msg.channel.send('⏸️  Already stopped.');
			return;
		}

		dispatcher.pause();
		msg.channel.send('⏸️  Stopped the music.');
	}
}
