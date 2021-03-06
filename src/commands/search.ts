import { Message, MessageReaction } from 'discord.js-light';

import { Command, Requirement } from '@models/command';
import { secondsToTime } from '@utils/functions';
import { DefaultEmbed } from '@models/embed';
import Reactions from '@utils/reactions';
import Bot from 'bot';

import { searchLimit } from '@config/global.json';

const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

export class Search implements Command {
	name = 'search';
	aliases = ['find', 'f'];
	description = 'Search for a song on a specified platform.';
	usage = 'search `[song to search for]`';
	requirements: Requirement[] = ['ROLE'];

	private reactions = new Reactions(emojis);

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	async run(msg: Message, args: Array<string>): Promise<void> {
		if (args.length < 1) {
			msg.channel.send('❌  Please enter a link/search entry.');
			return;
		}

		const search = args.join(' ');
		const sent = await msg.channel.send(`🔍  Searching for \`${search}\``);

		const settings = this.client.settings.get(msg.guild?.id);

		const results = await this.client.request.search(search, searchLimit, settings.search_platform);

		if (!results) {
			msg.channel.send(`❌  I was not able to find anything matching \`${search}\``);
			return;
		}

		const embed = new DefaultEmbed(msg.author);

		results.forEach((song, i) => {
			const count = emojis[i];

			const length = secondsToTime(song.length);
			const author = song.author;
			const info = `${author} - \`${length}\``;

			const title = `${count} - ${song.title}`;

			embed.addField(title, info, false);
		});

		embed.setTitle(`Showing results for \`${search}\``);
		embed.setDescription('Choose a song by reacting with one of the emojis below.');

		sent
			.edit('✅  Found the following:', embed)
			.then((msg) => this.reactions.listen(msg, () => this.handleReaction))
			.catch(console.log);
	}

	private handleReaction(reaction: MessageReaction) {
		console.log(reaction.emoji.name);
	}
}
