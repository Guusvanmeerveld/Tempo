import { Message } from 'discord.js';
import { Command, DefaultEmbed } from '../models';
import Console from '../utils/console';

import Genius from '../utils/requests/genius';

export class Lyrics implements Command {
	name: string;
	description: string;
	aliases: Array<string>;

	constructor() {
		this.name = 'lyrics';
		this.description = 'Search for any songs lyrics.';
		this.aliases = ['ly'];
	}

	run(msg: Message, args: Array<string>) {
		if (args.length < 1) {
			msg.channel.send('Please enter a song name to search for.');
			return;
		}

		const entry = args.join(' ');

		msg.channel
			.send(`🔍  Searching lyrics for \`${entry}\`. This might take a while...`)
			.then((sent) =>
				Genius.search(entry)
					.then((info) => {
						const embed = new DefaultEmbed(msg.author);

						embed.setTitle('Lyrics for: ' + info.title);
						embed.setDescription(info.lyrics ?? '❌  Error parsing lyrics');
						embed.setURL(info.url);

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
