import { Message } from 'discord.js-light';

import { Command, SongEmbed } from '@models/index';
import Bot from '../bot';

const PROGRESS_LINE = '⎯';
const PROGRESS_LOC = '⬤';

const PROGRESS_LENGTH = 40;

export class NowPlaying implements Command {
	name = 'now playing';
	aliases = ['np'];
	description = 'Displays the song that is currently playing';
	usage = 'nowplaying';

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	public run(msg: Message): void {
		const queue = this.client.queues.get(msg.guild?.id ?? '');

		if (!queue?.playing) {
			msg.channel.send('❌  There is nothing playing right now.');
			return;
		}

		const embed = new SongEmbed({ author: msg.author, song: queue.playing });

		const time = msg.guild?.voice?.connection?.dispatcher?.streamTime ?? 0;
		const length = queue.playing.length;

		const progressBar = this.createProgressBar(time, length);

		embed.setDescription(`${progressBar}`);

		msg.channel.send(embed);
	}

	private createProgressBar(streamTime: number, length: number): string {
		const progress = (streamTime / length) * PROGRESS_LENGTH;
		const base = PROGRESS_LINE.repeat(PROGRESS_LENGTH);

		// Replace character at right position with progress icon
		const bar = base.substring(0, progress) + PROGRESS_LOC + base.substring(progress + 1);

		return bar;
	}
}
