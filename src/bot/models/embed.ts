import { EmbedField, MessageEmbed, User } from 'discord.js-light';
import humanizeDuration from 'humanize-duration';
import { chunk, abbreviate, ucFirst } from '../utils/functions';
import { Song } from './song';

export class DefaultEmbed extends MessageEmbed {
	constructor(author?: User) {
		super();

		if (author) {
			const avatarURL = author.avatarURL() as string;
			this.setAuthor(`Requested by ${author.username}`, avatarURL);
		}

		this.setColor('#007AFF');
		this.setTimestamp();
	}
}

export class SongEmbed extends DefaultEmbed {
	constructor({ author, song }: { author: User; song: Song }) {
		super(author);

		this.setTitle(`Now playing: ${song?.title ?? 'Unknown song'}`);
		this.setThumbnail(song?.image);
		this.setURL(song?.url);

		this.addFields(
			{
				name: 'Published',
				value: song?.date.toLocaleDateString() ?? 'Unknown date',
				inline: true,
			},
			{ name: 'Author', value: song?.author, inline: true },
			{
				name: 'Platform',
				value: ucFirst(song.platform),
				inline: true,
			},
			{
				name: 'Length',
				value: humanizeDuration(song.length),
				inline: true,
			},
			{
				name: 'Streams',
				value: abbreviate(song?.views ?? 0),
				inline: true,
			}
		);

		if (song?.likes) {
			this.addField('Likes', abbreviate(song?.likes ?? 0), true);
		}

		if (song?.dislikes) {
			this.addField('Dislikes', abbreviate(song?.dislikes ?? 0), true);
		}
	}
}

export class PaginatedEmbed extends DefaultEmbed {
	page: number;
	constructor({
		author,
		args,
		fields,
	}: {
		author: User;
		args: Array<string>;
		fields: Array<EmbedField | undefined>;
	}) {
		super(author);

		this.page = 1;
		if (fields.length > 0) {
			const chunked = chunk(fields, 5);

			if (args.length > 0) {
				this.page = parseInt(args[0]);
				if (isNaN(this.page) || this.page < 1 || this.page > chunked.length) {
					return;
				}
			}

			this.setFooter(`Page ${this.page}/${chunked.length}`);

			chunked[this.page - 1].forEach((item: EmbedField) =>
				this.addField(item.name, item.value, item.inline)
			);
		}
	}
}
