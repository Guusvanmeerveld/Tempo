import { Message } from 'discord.js';
import { Command, Requirement } from '../models';

export class Pause implements Command {
	name = 'pause';
	requirements: Array<Requirement> = ['VOICE', 'ROLE'];
	description = 'Pause or play the music';

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

		const paused = dispatcher.paused;

		paused ? dispatcher.resume() : dispatcher.pause();
		msg.channel.send(`${paused ? 'Resumed' : 'Paused'} the music.`);
	}
}
