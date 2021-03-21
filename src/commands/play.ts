import { Command, Song, DefaultEmbed, Requirement } from '../models';

import Console from '../utils/console';
import { abbreviate, ucFirst } from '../utils/functions';

import { Join } from './join';
const join = new Join().run;

import ytdl from 'ytdl-core';

import { Readable } from 'node:stream';
import { Video } from 'ytsr';
import { Message } from 'discord.js';
import Bot from '../bot';

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

	/**
	 * Join the voice channel, get info about the song and play it.
	 * @param msg
	 * @param args
	 * @param client
	 */
	public async run(msg: Message, args: Array<string>, client: Bot, playskip?: boolean) {
		if (args.length < 1) {
			if (msg.attachments.array().length) {
				const first = msg.attachments.first();
				if (!first) return;

				await join(msg, args, client);
				this.stream(msg, client, first.attachment.toString());
				msg.channel.send('🎵  Now playing');
				return;
			}

			msg.channel.send('Please enter a link/search entry.');
			return;
		}

		const joined = await join(msg, args, client);

		if (!joined) return;

		const queue = client.queues.get(msg.guild!.id);

		this.info(msg, args, client)
			.then((info: Song) => {
				const song: Song = { requested: msg.author, ...info };
				const embed = new DefaultEmbed(msg.author);

				embed.setTitle(song?.title ?? 'Unknown song');
				embed.setThumbnail(song?.image);
				embed.setURL(song?.url);

				embed.addFields(
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
						name: 'Streams',
						value: abbreviate(song?.views ?? 0),
						inline: true,
					}
				);

				if (song?.likes) {
					embed.addField('Likes', abbreviate(song?.likes ?? 0), true);
				}

				if (song?.dislikes) {
					embed.addField('Dislikes', abbreviate(song?.dislikes ?? 0), true);
				}

				if (queue?.playing && !playskip) {
					queue.songs.push(song);
					msg.channel.send(`🎵  Added \`${song.title}\` to the queue.`, {
						embed,
					});

					return;
				}

				msg.channel.send('🎵  Now playing:', { embed });

				this.play(msg, client, song);
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
	public play(msg: Message, client: Bot, song: Song | undefined) {
		const queue = client.queues.get(msg.guild!.id);
		if (!queue) return;

		if (!song) {
			msg.guild?.voice?.channel?.leave();
			return;
		}

		queue.playing = song;

		switch (song.platform) {
			case 'youtube':
				this.stream(msg, client, ytdl(song.url, { filter: 'audioonly' }));
				break;
			case 'soundcloud':
				client.request.soundcloud
					.download(song.download)
					.then((stream) => this.stream(msg, client, stream))
					.catch(() => msg.channel.send('❌  Soundcloud song does not have a downloadable url'));
				break;
		}
	}

	/**
	 * Stream the song to the voice channel
	 * @param msg
	 * @param client
	 * @param stream
	 */
	private stream(msg: Message, client: Bot, stream: Readable | string) {
		if (msg.guild?.voice?.connection) {
			const connection = msg.guild.voice.connection;

			const settings = client.settings.get(msg.guild!.id);
			const volume = settings.volume;

			connection.play(stream, { volume: volume / 100 }).on('finish', () => {
				const queue = client.queues.get(msg.guild!.id);

				if (!queue) return;

				if (queue.loop) {
					this.play(msg, client, queue.playing);
					return;
				}

				if (queue.songs.length > 0) {
					const newSong = queue.songs.shift() as Song;

					queue.playing = newSong;
					this.play(msg, client, newSong);

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
	private async info(msg: Message, args: Array<string>, client: Bot): Promise<Song> {
		const input = args[0];
		if (input.match(YOUTUBE)) {
			return await client.request.youtube.info(input);
		}

		if (input.match(SOUNDCLOUD)) {
			return await client.request.soundcloud.info(input);
		}

		if (input.match(SPOTIFY)) {
			return await client.request.spotify.info(input);
		}

		if (input.match(AUDIO)) {
		}

		const search = args.join(' ');

		msg.channel.send(`🔍  Searching for \`${search}\`.`);
		return await this.search(search, msg, client);
	}

	/**
	 * Search on a given platform for a user input
	 * @param input
	 */
	private async search(input: string, msg: Message, client: Bot): Promise<Song> {
		const notFound = (platform: string) => `I was not able to find \`${input}\` on ${platform}.`;

		const settings = client.settings.get(msg.guild!.id);

		switch (settings.search_platform) {
			case 'soundcloud':
				const soundcloud = client.request.soundcloud;
				const tracks = await soundcloud.search(input, 1);

				if (tracks.collection.length < 1) {
					throw notFound('Soundcloud');
				}

				const track = tracks.collection[0];

				return await soundcloud.info(track.permalink_url);
			case 'spotify':
				const spotify = client.request.spotify;
				const songs = (await spotify.search(input, 1)).tracks;

				if (songs.items.length < 1) {
					throw notFound('Spotify');
				}

				const song = songs.items[0];

				return spotify.info(song.id);
			default:
				const youtube = client.request.youtube;
				const videos = await youtube.search(input, 1);

				if (videos.items.length < 1) {
					throw notFound('Youtube');
				}

				const video = videos.items[0] as Video;

				return youtube.info(video?.id ?? 'Unknown');
		}
	}
}
