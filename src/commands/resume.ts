import { Message } from 'discord.js-light';

import { Command, Requirement } from '@models/index';
import { checkConnection } from '@utils/functions';

export class Resume implements Command {
	name = 'resume';
	description = 'Resume the music.';
	usage = 'resume';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	aliases = ['re'];

	run(msg: Message): void {
		const { connection, connected, error } = checkConnection(msg.guild?.voice?.connection);

		if (connected) {
			const dispatcher = connection?.dispatcher;
			if (!dispatcher) return;

			if (!dispatcher.paused) {
				msg.channel.send('⏯️  Already resumed.');
				return;
			}

			dispatcher.resume();
			msg.channel.send('⏯️  Resumed the music.');
		} else if (error) {
			msg.channel.send(error);
		}
	}
}
