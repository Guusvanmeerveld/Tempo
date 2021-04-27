import { Message } from 'discord.js-light';

import { Command, Requirement } from '@models/command';
import { checkConnection } from '@utils/functions';

export class Pause implements Command {
	name = 'pause';
	requirements: Array<Requirement> = ['VOICE', 'ROLE'];
	usage = 'pause';
	description = 'Pause or play the music';

	run(msg: Message): void {
		const { connection, connected, error } = checkConnection(msg.guild?.voice?.connection);

		if (connected) {
			const dispatcher = connection?.dispatcher;
			if (!dispatcher) return;

			const paused = dispatcher.paused;

			paused ? dispatcher.resume() : dispatcher.pause();
			msg.channel.send(`${paused ? '⏯️  Resumed' : '⏸  Paused'} the music.`);
		} else if (error) {
			msg.channel.send(error);
		}
	}
}
