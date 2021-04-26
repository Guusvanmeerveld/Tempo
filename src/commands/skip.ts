import { Message } from 'discord.js-light';

import { Command, Requirement } from '@models/command';
import { checkConnection } from '@utils/functions';
import { QueueList } from '@models/queue';
import { Play } from './play';
import Bot from '../bot';

export class Skip implements Command {
	name = 'skip';
	usage = 'skip [amount of songs to skip]';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	aliases = ['s'];
	description = 'Skip the current song.';

	client;
	private player;
	constructor(client: Bot) {
		this.client = client;
		this.player = new Play(client);
	}

	run(msg: Message, args: Array<string>): void {
		const { connected } = checkConnection(msg.guild?.voice?.connection);

		if (connected) {
			const queue = this.client.queue.get(msg.guild?.id ?? '') as QueueList;

			let count = 1;

			if (args.length > 0) {
				count = parseInt(args[0]);

				if (queue.songs.length < count - 1 || count < 1) {
					msg.channel.send(
						`That is not a valid number of songs to skip. Please specify a number between 1 - ${
							queue.songs.length + 1
						}`
					);
					return;
				}
			}

			msg.channel.send('⏩  Successfully skipped the song.');
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.player.play(msg.guild!, queue.songs[count - 1]);
			queue?.songs.splice(0, count);
		}
	}
}
