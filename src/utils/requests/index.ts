import { Item, Video } from 'ytsr';

import { SpotifyTrackAPI, SoundCloudTrackAPI, YoutubeVideoAPI } from '@models/requests/';

import { searchPlatform } from '@models/settings';
import { parseTime, ytDurationToMs } from '@utils/functions';
import { Song, SoundCloudSong } from '@models/song';

import Discord from './discord';
import Genius from './genius';
import SoundCloud from './soundcloud';
import Spotify from './spotify';
import Youtube from './youtube';

export default class Request {
	public discord = new Discord();
	public genius = new Genius();
	public soundcloud = new SoundCloud();
	public spotify = new Spotify();
	public youtube = new Youtube();

	/**
	 * Search on a given platform for a user input.
	 * @param {string} input - The input to search for.
	 * @param {number} max - The max amount of results to return.
	 * @param {searchPlatform} searchPlatform - The platform to search on.
	 * @returns {Promise<Array<Song>>} An array of songs that where found.
	 */
	public async search(
		input: string,
		max: number,
		searchPlatform: searchPlatform
	): Promise<Array<Song>> {
		const notFound = (platform: string) => `I was not able to find \`${input}\` on ${platform}.`;

		let platform;
		let results;
		let songs: Song[];

		switch (searchPlatform) {
			case 'soundcloud':
				platform = this.soundcloud;
				results = await platform.search(input, max);

				if (results.collection.length < 1) {
					throw notFound('Soundcloud');
				}

				songs = results.collection.map(Convert.soundcloud);

				break;
			case 'spotify':
				platform = this.spotify;
				results = (await platform.search(input, max)).tracks;

				if (results.items.length < 1) {
					throw notFound('Spotify');
				}

				songs = results.items.map(Convert.spotify);

				break;
			default:
				platform = this.youtube;
				results = await platform.search(input, max);

				if (results.items.length < 1) {
					throw notFound('Youtube');
				}

				songs = results.items.map(Convert.ytsr);
				break;
		}

		return songs;
	}
}

export class Convert {
	public static soundcloud(track: SoundCloudTrackAPI): SoundCloudSong {
		return {
			title: track.title,
			platform: 'soundcloud',
			author: track.publisher_metadata?.artist ?? 'Unknown artist',
			date: new Date(track.created_at),
			image: track.artwork_url ?? '',
			length: track.duration,
			stats: {
				likes: track.likes_count,
				views: track.playback_count,
			},
			url: track.permalink_url,
			download: track.media?.transcodings[0].url,
			downloadable: track.downloadable,
		};
	}

	public static spotify(track: SpotifyTrackAPI): Song {
		const artists = track.artists.map((artist) => artist.name).join(', ');

		return {
			title: track.name,
			platform: 'spotify',
			author: artists,
			date: new Date(track.album.release_date),
			image: track.album.images[0].url,
			length: track.duration_ms,
			url: track.href,
			stats: {},
		};
	}

	public static youtube(tracks: YoutubeVideoAPI): Song {
		const video = tracks.items[0];

		const snippet = video.snippet;
		const statistics = video.statistics;
		const contentDetails = video.contentDetails;

		return {
			title: snippet.title,
			platform: 'youtube',
			author: snippet.channelTitle,
			date: new Date(snippet.publishedAt),
			image: snippet.thumbnails.high.url,
			length: ytDurationToMs(contentDetails.duration),
			url: `https://youtu.be/${video.id}`,
			stats: {
				dislikes: parseInt(statistics.dislikeCount),
				likes: parseInt(statistics.likeCount),
				views: parseInt(statistics.viewCount),
			},
		};
	}

	public static ytsr(track: Item): Song {
		track = track as Video;
		const duration = parseTime(track.duration ?? '0');

		return {
			title: track.title,
			platform: 'youtube',
			author: track.author?.name ?? 'Unknown author',
			date: new Date(track.uploadedAt ?? 'Unknown date'),
			image: track.bestThumbnail.url ?? 'No url given',
			length: duration,
			url: track.url,
			stats: {
				views: track.views ?? 0,
			},
		};
	}
}
