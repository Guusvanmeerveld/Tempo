import { Message } from 'discord.js';
import Bot from '../bot';
import { Command, DefaultEmbed } from '@models/index';
import Console from '@utils/console';

import Genius from '@utils/requests/genius';

export class Lyrics implements Command {
	name = 'lyrics';
	description = 'Search for any songs lyrics.';
	usage = 'lyrics [name of song]';
	aliases = ['ly'];

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	run(msg: Message, args: Array<string>) {
		let entry: string;

		if (args.length < 1) {
			const queue = this.client.queues.get(msg.guild!.id);
			if (!queue?.playing) {
				msg.channel.send('Please enter a song name to search for.');
				return;
			}

			entry = queue.playing.title;
		} else {
			entry = args.join(' ');
		}

		msg.channel
			.send(`🔍  Searching lyrics for \`${entry}\`. This might take a while...`)
			.then((sent) =>
				Genius.search(entry)
					.then((info) => {
						const embed = new DefaultEmbed(msg.author);

						embed.setTitle('Lyrics for: ' + info.title);
						embed.setDescription(info.lyrics ?? '❌  Error parsing lyrics');
						embed.setURL(info.url);
						embed.setThumbnail(info.image);

						embed.setFooter('Lyrics provided by Genius.com');

						sent.edit('', embed);
					})
					.catch((error) => {
						Console.error(error);
						sent.edit('❌  ' + error);
					})
			);
	}
}
