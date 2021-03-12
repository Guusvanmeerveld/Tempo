import { Message } from 'discord.js';
import { EmbedField } from 'discord.js-light';
import Bot from '../bot';
import { Command, PaginatedEmbed, Requirement, Song } from '../models';

export class Queue implements Command {
	name: string;
	aliases: Array<string>;
	description: string;
	requirements: Array<Requirement>;

	constructor() {
		this.name = 'queue';
		this.aliases = ['q'];
		this.requirements = ['VOICE'];
		this.description = 'Gives a list of all the songs currently in the queue.';
	}

	run(msg: Message, args: Array<string>, client: Bot) {
		const queue = client.queues.get(msg.guild?.id ?? '');

		if (!queue?.playing) {
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

		embed.setDescription(
			`Currently playing: \`${
				queue.playing?.title ?? 'Nothing'
			}\` requested by ${queue.playing.requested?.toString()}`
		);

		embed.setTitle('Songs in the queue');

		msg.channel.send(embed);
	}
}
