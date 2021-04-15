import { Message } from 'discord.js-light';
import { Readable } from 'node:stream';
import { Video } from 'ytsr';
import ytdl from 'ytdl-core';
import Bot from '../bot';

import { Command, Song, Requirement, SongEmbed } from '@models/index';
import Console from '@utils/console';
import { Join } from './join';

const YOUTUBE = /^(https?:\/\/)?(www\.)?(m\.)?(youtube.com|youtu\.?be)\/.+$/g;
const SOUNDCLOUD = /^https?:\/\/(soundcloud\.com)\/(.*)$/g;
const SPOTIFY = /^https?:\/\/(open\.spotify\.com\/track)\/(.*)$/g;
const AUDIO = /^\.(?:wav|mp3)$/g;

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
	public async run(msg: Message, args: Array<string>, playskip?: boolean) {
		if (args.length < 1) {
			this.playAttachment(msg);
		}

		const joined = await this.join(msg);

		if (!joined) return;

		const queue = this.client.queues.get(msg.guild!.id);

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
	public async play(msg: Message, song: Song | undefined, seek?: number) {
		const queue = this.client.queues.get(msg.guild!.id);
		if (!queue) return;

		if (!song) {
			msg.guild?.voice?.channel?.leave();
			return;
		}

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

			const settings = this.client.settings.get(msg.guild!.id);
			const volume = settings.volume;

			connection.play(stream, { volume: volume / 100, seek }).on('finish', () => {
				const queue = this.client.queues.get(msg.guild!.id);

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
			return await this.client.request.youtube.info(input);
		}

		if (input.match(SOUNDCLOUD)) {
			return await this.client.request.soundcloud.info(input);
		}

		if (input.match(SPOTIFY)) {
			return await this.client.request.spotify.info(input);
		}

		if (input.match(AUDIO)) {
		}

		const search = args.join(' ');

		msg.channel.send(`🔍  Searching for \`${search}\`.`);
		return await this.search(search, msg);
	}

	/**
	 * Search on a given platform for a user input
	 * @param input
	 */
	private async search(input: string, msg: Message): Promise<Song> {
		const notFound = (platform: string) => `I was not able to find \`${input}\` on ${platform}.`;

		const settings = this.client.settings.get(msg.guild!.id);

		switch (settings.search_platform) {
			case 'soundcloud':
				const soundcloud = this.client.request.soundcloud;
				const tracks = await soundcloud.search(input, 1);

				if (tracks.collection.length < 1) {
					throw notFound('Soundcloud');
				}

				const track = tracks.collection[0];

				return await soundcloud.info(track.permalink_url);
			case 'spotify':
				const spotify = this.client.request.spotify;
				const songs = (await spotify.search(input, 1)).tracks;

				if (songs.items.length < 1) {
					throw notFound('Spotify');
				}

				const song = songs.items[0];

				return spotify.info(song.id);
			default:
				const youtube = this.client.request.youtube;
				const videos = await youtube.search(input, 1);

				if (videos.items.length < 1) {
					throw notFound('Youtube');
				}

				const video = videos.items[0] as Video;

				return youtube.info(video?.id ?? 'Unknown');
		}
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

		msg.channel.send('Please enter a link/search entry.');
		return;
	}
}
