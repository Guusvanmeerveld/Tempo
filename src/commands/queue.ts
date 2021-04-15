import { Message, EmbedField } from 'discord.js-light';

import { Command, PaginatedEmbed, Requirement, Song } from '@models/index';
import Bot from '../bot';

export class Queue implements Command {
	name = 'queue';
	aliases = ['q'];
	usage = 'queue';
	requirements: Requirement[] = ['VOICE'];
	description = 'Gives a list of all the songs currently in the queue.';

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	run(msg: Message, args: Array<string>) {
		const queue = this.client.queues.get(msg.guild!.id);

		if (!queue) return;

		if (queue.songs.length < 1) {
			msg.channel.send('❌  Queue is empty.');
			return;
		}

		let fields: Array<EmbedField> = [];
		if (queue.songs.length > 0) {
			fields = queue.songs.map((song: Song, i) => {
				return {
					name: `#${i + 1} ${song.title}`,
					value: 'Requested by ' + song.requested?.toString() ?? 'Unknown user',
					inline: false,
				};
			});
		}

		const embed = new PaginatedEmbed({
			author: msg.author,
			args,
			fields,
		});

		// if (queue.playing)
		// 	embed.setDescription(
		// 		`Currently playing: \`${
		// 			queue.playing?.title ?? 'Nothing'
		// 		}\` requested by ${queue.playing.requested?.toString()}`
		// 	);

		embed.setTitle('Songs in the queue');

		msg.channel.send(embed);
	}
}
