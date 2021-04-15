import { checkConnection } from '@utils/functions';
import { Message } from 'discord.js';
import { Command, Requirement } from '@models/index';

export class Pause implements Command {
	name = 'pause';
	requirements: Array<Requirement> = ['VOICE', 'ROLE'];
	usage = 'pause';
	description = 'Pause or play the music';

	run(msg: Message) {
		const { connection, connected, error } = checkConnection(msg.guild?.voice?.connection);

		if (connected) {
			const dispatcher = connection?.dispatcher!;

			const paused = dispatcher.paused;

			paused ? dispatcher.resume() : dispatcher.pause();
			msg.channel.send(`${paused ? 'Resumed' : 'Paused'} the music.`);
		} else if (error) {
			msg.channel.send(error);
		}
	}
}
