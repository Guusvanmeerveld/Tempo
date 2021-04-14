import { checkConnection } from '../utils/functions';
import { Message } from 'discord.js-light';
import { Command, Requirement } from '../models';

export class Resume implements Command {
	name = 'resume';
	description = 'Resume the music.';
	usage = 'resume';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	aliases = ['re'];

	run(msg: Message) {
		const { connection, connected, error } = checkConnection(msg.guild?.voice?.connection);

		if (connected) {
			const dispatcher = connection?.dispatcher!;

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
