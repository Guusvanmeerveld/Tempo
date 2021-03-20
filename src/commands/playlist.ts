import { Message } from 'discord.js';
import Bot from '../bot';
import { Album, Command, DefaultEmbed, Requirement, Song } from '../models';

const SPOTIFY_PLAYLIST = /^https?:\/\/(open\.spotify\.com\/playlist)\/(.*)$/g;
export const SPOTIFY_ALBUM = /^https?:\/\/(open\.spotify\.com\/album)\/(.*)$/g;

export const YOUTUBE_PLAYLIST = /^(https?:)\/\/?(www\.)?(m\.)?(youtube.com|youtu\.?be)\/(playlist\?list=)(.*)$/g;

export class PlayList implements Command {
	name = 'playlist';
	description = 'Enter a playlist and add it to the queue.';
	requirements: Requirement[] = ['VOICE'];
	usage = 'playlist [link to playlist]';
	aliases = ['pl'];

	public run(msg: Message, args: Array<string>, client: Bot) {
		const input = args[0];

		this.album(input, client).then((album) => {
			if (!album) {
				msg.channel.send(
					`❌  Something went wrong looking up that playlist/album. Please try again later.`
				);
				return;
			}

			const embed = new DefaultEmbed(msg.author);

			embed.setThumbnail(album.image);
			embed.setTitle(`Added \`${album.name}\` to the queue.`);

			embed.addField('Artist(s)', album.author.join(', '), true);

			embed.addFields(
				{
					name: 'Platform',
					value: album.platform,
					inline: true,
				},
				{
					name: 'Published',
					value: album.date.toLocaleDateString(),
					inline: true,
				}
			);

			if (album.genres && album.genres.length > 0) {
				embed.addField('Genres', album.genres.join(', '), true);
			}

			msg.channel.send(embed);

			const queue = client.queues.get(msg.guild!.id);
			if (!queue) return;

			Array.prototype.push.apply(
				queue.songs,
				album.songs.map((g) => {
					return {
						...g,
						requested: msg.author,
					};
				})
			);
		});
	}

	private async album(input: string, client: Bot): Promise<Album | undefined> {
		if (input.match(SPOTIFY_ALBUM)) {
			const spotify = client.request.spotify;
			const id = spotify.id(input);

			const album = await spotify.get('albums', id);

			if (!album) return;

			const date = new Date(Date.parse(album.release_date));
			const image = album.images[0].url;

			const songs: Song[] = album.tracks.items.map((g) => {
				return {
					title: g.name,
					author: g.artists.join(''),
					date,
					image,
					platform: 'spotify',
					url: g.external_urls.spotify,
				};
			});

			return {
				author: album.artists.map((g) => g.name),
				date,
				image,
				name: album.name,
				platform: 'spotify',
				url: album.external_urls.spotify,
				genres: album.genres,
				songs,
			};
		}

		// if (input.match(YOUTUBE_PLAYLIST)) {
		// 	const youtube = client.request.youtube;
		// 	const id = youtube.id(input);
		// }
	}
}
