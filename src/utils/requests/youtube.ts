const youtubeToken = process.env.YOUTUBE;

import { Song } from '@models/song';
import { YoutubeVideoAPI } from '@models/requests';

import axios from 'axios';
import ytsr, { Result } from 'ytsr';
import { ytDurationToMs } from '@utils/functions';

const request = axios.create({
	baseURL: 'https://www.googleapis.com/youtube/v3/',
	params: { key: youtubeToken },
});

const video = /^(https:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]).*$/;
const playlist = /^(https:\/\/)?(www\.)?(youtube\.com\/playlist\?list=)([0-9A-Za-z_-]{34}).*$/g;

export default class Youtube {
	/**
	 * Get information about a video on Youtube.
	 * @param id
	 */
	public async video(id: string): Promise<YoutubeVideoAPI> {
		const { data } = await request('videos', {
			params: {
				part: 'snippet,statistics,contentDetails',
				id,
			},
		});

		return data;
	}

	public async playlist(id: string): Promise<unknown> {
		const { data } = await request('playlists', {
			params: {
				part: 'snippet',
				id,
			},
		});

		return data;
	}

	/**
	 * Search for a set number of videos on Youtube.
	 * @param query
	 * @param limit
	 */
	public async search(query: string, limit: number): Promise<Result> {
		const data = await ytsr(query, {
			limit,
		});

		return data;
	}

	/**
	 * Get the video id from a youtube url.
	 * @param url
	 */
	public id(url: string): string {
		let match = url.match(video);

		if (match && match.length > 1) {
			return match[4];
		}

		match = url.match(playlist);

		return url;
	}

	/**
	 * Get info about a song on Youtube.
	 * @param input The youtube video link
	 */
	public async info(input: string): Promise<Song> {
		const id = this.id(input);
		const data = await this.video(id);

		const video = data.items[0];

		if (!video) throw 'Could not find any information about this video.';

		const snippet = video.snippet;
		const statistics = video.statistics;
		const contentDetails = video.contentDetails;

		return {
			platform: 'youtube',
			title: snippet.title,
			author: snippet.channelTitle,
			image: snippet.thumbnails.high.url,
			date: new Date(snippet.publishedAt),
			views: parseInt(statistics.viewCount),
			likes: parseInt(statistics.likeCount),
			dislikes: parseInt(statistics.dislikeCount),
			url: `https://youtu.be/${video.id}`,
			length: ytDurationToMs(contentDetails.duration),
		};
	}
}
