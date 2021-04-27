import { Message } from 'discord.js-light';

import { Command } from '@models/command';
import { SongEmbed } from '@models/embed';
import Bot from '../bot';

import { progressBar } from '@config/global.json';

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
		const queue = this.client.queue.get(msg.guild?.id ?? '');

		if (!queue?.playing) {
			msg.channel.send('❌  There is nothing playing right now.');
			return;
		}

		const embed = new SongEmbed({ author: msg.author, song: queue.playing });

		const time = Date.now() - (queue.playing.started ?? 0);
		const length = queue.playing.length;

		const progressBar = this.createProgressBar(time, length);

		embed.setDescription(`${progressBar}`);

		msg.channel.send(embed);
	}

	private createProgressBar(streamTime: number, length: number): string {
		const progress = (streamTime / length) * progressBar.length;
		const base = progressBar.line.repeat(progressBar.length);

		// Replace character at right position with progress icon
		const bar = base.substring(0, progress) + progressBar.location + base.substring(progress + 1);

		return bar;
	}
}
