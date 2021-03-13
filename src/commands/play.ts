import { Command, Song, DefaultEmbed, Requirement, Setting } from '../models';

import Console from '../utils/console';
import { abbreviate, ucFirst } from '../utils/functions';

import youtube from '../utils/requests/youtube';
import soundcloud from '../utils/requests/soundcloud';
import Spotify from '../utils/requests/spotify';

const spotify = new Spotify();

import { Join } from './join';
const join = new Join().run;

import ytdl from 'ytdl-core';

import { Readable } from 'node:stream';
import { Video } from 'ytsr';
import { Message } from 'discord.js';
import Bot from '../bot';

const ytRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube.com|youtu\.?be)\/.+$/gi;
const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
const spRegex = /^https?:\/\/(open\.spotify\.com\/track)\/(.*)$/;
const audioPattern = /\.(?:wav|mp3)$/i;

export class Play implements Command {
	public name: string;
	public aliases: Array<string>;
	public requirements: Array<Requirement>;
	public description: string;

	constructor() {
		this.name = 'play';
		this.aliases = ['p'];
		this.requirements = ['VOICE', 'ROLE'];
		this.description = 'Play a song via a link or a search request.';
	}

	/**
	 * Join the voice channel, get info about the song and play it.
	 * @param msg
	 * @param args
	 * @param client
	 */
	public async run(msg: Message, args: Array<string>, client: Bot, playskip?: boolean) {
		if (args.length < 1) {
			if (msg.attachments) {
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

		await join(msg, args, client);

		const queue = client.queues.get(msg.guild?.id ?? '');

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
		if (!song) {
			msg.guild?.voice?.channel?.leave();
			return;
		}

		const queue = client.queues.get(msg.guild?.id ?? '');

		if (!queue) return;

		queue.playing = song;

		switch (song.platform) {
			case 'youtube':
				this.stream(msg, client, ytdl(song.url, { filter: 'audioonly' }));
				break;
			case 'soundcloud':
				soundcloud
					.download(song.download)
					.then((stream) => this.stream(msg, client, stream))
					.catch(() =>
						msg.channel.send(
							'❌  Soundcloud song does not have a downloadable url'
						)
					);
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
				const queue = client.queues.get(msg.guild?.id ?? '');

				if (!queue) return;

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
		if (input.match(ytRegex)) {
			return await youtube.info(input);
		}

		if (input.match(scRegex)) {
			return await soundcloud.info(input);
		}

		if (input.match(spRegex)) {
			return await spotify.info(input);
		}

		if (input.match(audioPattern)) {
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
		const notFound = (platform: string) =>
			`I was not able to find \`${input}\` on ${platform}.`;

		const search_platform = client.settings.get(msg.guild!.id, Setting.Search_Platform);

		switch (search_platform) {
			case 'soundcloud':
				const tracks = await soundcloud.search(input, 1);

				if (tracks.collection.length < 1) {
					throw notFound('Soundcloud');
				}

				const track = tracks.collection[0];

				return await soundcloud.info(track.permalink_url);
			case 'spotify':
				const songs = (await spotify.search(input, 1)).tracks;

				if (songs.items.length < 1) {
					throw notFound('Spotify');
				}

				const song = songs.items[0];

				return spotify.info(song.id);
			default:
				const videos = await youtube.search(input, 1);

				if (videos.items.length < 1) {
					throw notFound('Youtube');
				}

				const video = videos.items[0] as Video;

				return youtube.info(video?.id ?? 'Unknown');
		}
	}
}
