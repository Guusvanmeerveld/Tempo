import HumanizeDuration from 'humanize-duration';
import { Message } from 'discord.js-light';

import { Command, Requirement } from '@models/command';
import { checkConnection, parseTime } from '@utils/functions';
import { Play } from './play';
import Bot from '../bot';

export class Seek implements Command {
	name = 'seek';
	description = 'Skip to a certain part of the song that is currently playing';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	aliases = ['skipto'];
	usage = 'seek [hours:minutes:seconds]';

	client;
	private player;
	constructor(client: Bot) {
		this.client = client;
		this.player = new Play(client);
	}

	run(msg: Message, args: Array<string>): void {
		const { connected, error } = checkConnection(msg.guild?.voice?.connection);

		if (connected) {
			const time = args[0];

			if (time) {
				const queue = this.client.queues.get(msg.guild?.id ?? '');
				const song = queue?.playing;

				if (!song) return;

				const ms = parseTime(time);

				if (ms > song.length || ms <= 0) {
					msg.channel.send('❌  That is not a valid timestamp.');
					return;
				}

				msg.channel.send(`⏩  Successfully skipped to \`${HumanizeDuration(ms)}\`.`);
				this.player.play(msg, song, ms / 1000);
			} else {
				msg.channel.send('❌  You must give a timestamp to skip to.');
			}
		} else if (error) {
			msg.channel.send(error);
		}
	}
}
