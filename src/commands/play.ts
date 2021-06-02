/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Guild, Message, MessageReaction } from 'discord.js-light';
import { Readable } from 'stream';
import ytdl from 'ytdl-core';

import { Command, Requirement } from '@models/command';
import { Song, SoundCloudSong } from '@models/song';
import { Convert } from '@utils/requests';
import { SongEmbed } from '@models/embed';
import Reactions from '@utils/reactions';
import Console from '@utils/console';
import { Join } from './join';
import Bot from '../bot';

const YOUTUBE = /^(https?:\/\/)?(www\.)?(m\.)?(youtube.com|youtu\.?be)\/.+$/g;
const SOUNDCLOUD = /^https?:\/\/(soundcloud\.com)\/(.*)$/g;
const SPOTIFY = /^https?:\/\/(open\.spotify\.com\/track)\/(.*)$/g;
// const AUDIO = /^\.(?:wav|mp3)$/g;

const playEmojis = ['⏪', '⏯️', '⏩'];

import { queueLimit } from '@config/global.json';

export class Play implements Command {
	name = 'play';
	aliases = ['p'];
	usage = 'play [name of song / link to song]';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	description = 'Play a song via a link or a search request.';

	client;
	join;
	reactions;
	constructor(client: Bot) {
		this.client = client;
		this.join = (client.commands.get('join') as Join).run;
		this.reactions = new Reactions(playEmojis);
	}

	/**
	 * Join the voice channel, get info about the song and play it.
	 * @param msg
	 * @param args
	 * @param client
	 */
	public run(msg: Message, args: Array<string>, playskip?: boolean): void {
		if (args.length < 1) {
			this.playAttachment(msg);
			return;
		}

		this.info(msg, args)
			.then(async (song: Song) => {
				const joined = await this.join(msg);

				if (!joined) return;

				song.requested = msg.author;
				const embed = new SongEmbed({ author: msg.author, song });

				const queue = this.client.queue.get(msg.guild?.id ?? '');

				if (queue?.playing && !playskip) {
					if (queue.songs.length >= queueLimit) {
						msg.channel.send('❌  You cannot add more than 50 songs to the queue.');
						return;
					}

					queue.songs.push(song);

					msg.channel.send(`🎵  Added \`${song.title}\` to the queue.`, {
						embed,
					});

					return;
				}

				msg.channel
					.send('🎵  Now playing:', embed)
					.then((msg) =>
						this.reactions.listen(msg, (reaction) => this.reactionPlayer(reaction, msg.guild!))
					);

				this.play(msg.guild!, song);
			})
			.catch((error) => {
				Console.error(error);

				msg.channel.send('❌  ' + error);
			});
	}

	private reactionPlayer(reaction: MessageReaction, guild: Guild) {
		const currentPlaying = this.client.queue.get(guild.id)?.playing;
		if (!currentPlaying) return;

		const playingFor = (Date.now() - (currentPlaying?.started ?? 0)) / 1000;

		switch (reaction.emoji.name) {
			case '⏪':
				this.play(guild, currentPlaying, playingFor - 10);

				break;
			case '⏯️':
				const dispatcher = guild.voice?.connection?.dispatcher;

				if (dispatcher) {
					if (dispatcher.paused) dispatcher.resume();
					else dispatcher.pause();
				}
				break;
			case '⏩':
				this.play(guild, currentPlaying, playingFor + 10);
				break;
		}
	}

	/**
	 * Determine the platform and stream the song.
	 * @param msg
	 * @param client
	 * @param song
	 */
	public async play(guild: Guild, song: Song | undefined, seek?: number): Promise<void> {
		const queue = this.client.queue.get(guild.id);
		if (!queue) return;

		if (!song) {
			guild?.voice?.channel?.leave();
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
				const track = song as SoundCloudSong;

				if (!track.downloadable) {
					// msg.channel.send('❌  This Soundcloud song does not have a downloadable url.');
					return;
				}

				stream = await this.client.request.soundcloud.download(track.download);

				break;
		}

		this.stream(guild, stream, seek);
	}

	/**
	 * Stream the song to the voice channel
	 * @param msg
	 * @param client
	 * @param stream
	 */
	private stream(guild: Guild, stream: Readable | string, seek?: number) {
		if (guild.voice?.connection) {
			const connection = guild.voice.connection;

			const settings = this.client.settings.get(guild.id);
			const volume = settings.volume;

			connection.play(stream, { volume: volume / 100, seek }).on('finish', () => {
				const id = guild?.id ?? '';
				const queue = this.client.queue.get(id);

				if (!queue) return;

				if (queue.loop) {
					this.play(guild, queue.playing);
					return;
				}

				const shifted = this.client.queue.shift(id);
				if (shifted) {
					this.play(guild, shifted);

					return;
				}

				guild.voice?.channel?.leave();
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

			this.stream(msg.guild!, first.attachment.toString());
			msg.channel.send('🎵  Now playing');

			return;
		}

		msg.channel.send('❌  Please enter a link/search entry.');
		return;
	}
}
