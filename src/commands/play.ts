import { Message } from 'discord.js-light';
import { Readable } from 'node:stream';
import ytdl from 'ytdl-core';
import Bot from '../bot';

import { Command, Requirement } from '@models/command';
import { Convert } from '@utils/requests';
import { SongEmbed } from '@models/embed';
import { Song } from '@models/song';
import Console from '@utils/console';
import { Join } from './join';

const YOUTUBE = /^(https?:\/\/)?(www\.)?(m\.)?(youtube.com|youtu\.?be)\/.+$/g;
const SOUNDCLOUD = /^https?:\/\/(soundcloud\.com)\/(.*)$/g;
const SPOTIFY = /^https?:\/\/(open\.spotify\.com\/track)\/(.*)$/g;
// const AUDIO = /^\.(?:wav|mp3)$/g;

export class Play implements Command {
	name = 'play';
	aliases = ['p'];
	usage = 'play [name of song / link to song]';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	description = 'Play a song via a link or a search request.';

	client;
	join;
	constructor(client: Bot) {
		this.client = client;
		this.join = new Join(client).run;
	}

	/**
	 * Join the voice channel, get info about the song and play it.
	 * @param msg
	 * @param args
	 * @param client
	 */
	public async run(msg: Message, args: Array<string>, playskip?: boolean): Promise<void> {
		if (args.length < 1) {
			this.playAttachment(msg);
			return;
		}

		const joined = await this.join(msg);

		if (!joined) return;

		const queue = this.client.queues.get(msg.guild?.id ?? '');

		this.info(msg, args)
			.then((info: Song) => {
				const song: Song = { requested: msg.author, ...info };
				const embed = new SongEmbed({ author: msg.author, song });

				if (queue?.playing && !playskip) {
					queue.songs.push(song);
					msg.channel.send(`🎵  Added \`${song.title}\` to the queue.`, {
						embed,
					});

					return;
				}

				msg.channel.send('🎵  Now playing:', { embed });

				this.play(msg, song);
			})
			.catch((error) => {
				Console.error(error);

				msg.channel.send('❌  ' + error);
			});
	}

	/**
	 * Determine the platform and stream the song.
	 * @param msg
	 * @param client
	 * @param song
	 */
	public async play(msg: Message, song: Song | undefined, seek?: number): Promise<void> {
		const queue = this.client.queues.get(msg.guild?.id ?? '');
		if (!queue) return;

		if (!song) {
			msg.guild?.voice?.channel?.leave();
			return;
		}

		song.started = Date.now() - (seek ?? 0) * 1000;
		queue.playing = song;

		let stream: Readable | string;

		switch (song.platform) {
			default:
				stream = ytdl(song.url, { filter: 'audioonly' });
				break;
			case 'soundcloud':
				stream = await this.client.request.soundcloud.download(song.download);

				if (!stream) {
					msg.channel.send('❌  Soundcloud song does not have a downloadable url');
				}
				break;
		}

		this.stream(msg, stream, seek);
	}

	/**
	 * Stream the song to the voice channel
	 * @param msg
	 * @param client
	 * @param stream
	 */
	private stream(msg: Message, stream: Readable | string, seek?: number) {
		if (msg.guild?.voice?.connection) {
			const connection = msg.guild.voice.connection;

			const settings = this.client.settings.get(msg.guild.id);
			const volume = settings.volume;

			connection.play(stream, { volume: volume / 100, seek }).on('finish', () => {
				const queue = this.client.queues.get(msg.guild?.id ?? '');

				if (!queue) return;

				if (queue.loop) {
					this.play(msg, queue.playing);
					return;
				}

				if (queue.songs.length > 0) {
					const newSong = queue.songs.shift() as Song;

					queue.playing = newSong;
					this.play(msg, newSong);

					return;
				}

				msg.guild?.voice?.channel?.leave();
			});
		}
	}

	/**
	 * Get info about a certain user input.
	 * @param msg
	 * @param args
	 */
	private async info(msg: Message, args: Array<string>): Promise<Song> {
		const input = args[0];
		if (input.match(YOUTUBE)) {
			const id = this.client.request.youtube.id(input);
			const data = await this.client.request.youtube.video(id);

			return Convert.youtube(data);
		}

		if (input.match(SOUNDCLOUD)) {
			const song = await this.client.request.soundcloud.track(input);

			return Convert.soundcloud(song);
		}

		if (input.match(SPOTIFY)) {
			const id = this.client.request.spotify.id(input);

			const song = await this.client.request.spotify.get('tracks', id);

			return Convert.spotify(song);
		}

		// if (input.match(AUDIO)) {
		// }

		const searchQuery = args.join(' ');

		msg.channel.send(`🔍  Searching for \`${searchQuery}\`.`);
		const settings = this.client.settings.get(msg.guild?.id);

		const results = await this.client.request.search(searchQuery, 1, settings.search_platform);
		return results[0];
	}

	private async playAttachment(msg: Message) {
		if (msg.attachments.array().length) {
			const first = msg.attachments.first();
			if (!first) return;

			await this.join(msg);
			this.stream(msg, first.attachment.toString());
			msg.channel.send('🎵  Now playing');
			return;
		}

		msg.channel.send('❌  Please enter a link/search entry.');
		return;
	}
}
