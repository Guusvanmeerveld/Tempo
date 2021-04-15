import { Message } from 'discord.js-light';

import { Command, Requirement } from '@models/index';
import { checkConnection } from '@utils/functions';

export class Stop implements Command {
	name = 'stop';
	description = 'Stop the music.';
	usage = 'stop';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	aliases = ['st'];

	run(msg: Message): void {
		const { connection, connected, error } = checkConnection(msg.guild?.voice?.connection);

		if (connected) {
			const dispatcher = connection?.dispatcher;
			if (!dispatcher) return;

			if (dispatcher.paused) {
				msg.channel.send('⏸️  Already stopped.');
				return;
			}

			dispatcher.pause();
			msg.channel.send('⏸️  Stopped the music.');
		} else if (error) {
			msg.channel.send(error);
		}
	}
}
