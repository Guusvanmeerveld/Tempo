const youtubeToken = process.env.YOUTUBE;

import { YoutubeVideoAPI } from '@models/requests';

import axios from 'axios';
import ytsr, { Result } from 'ytsr';

const request = axios.create({
	baseURL: 'https://www.googleapis.com/youtube/v3/',
	params: { key: youtubeToken },
});

const video =
	/^(https:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]).*$/;
const playlist = /^(https:\/\/)?(www\.)?(youtube\.com\/playlist\?list=)([0-9A-Za-z_-]{34}).*$/g;

export default class Youtube {
	/**
	 * Get information about a video using its id.
	 * @param {string} id - The id of the video.
	 * @returns {Promise<YoutubeVideoAPI>} Information about the video.
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

	/**
	 * Get information about a playlist using its id.
	 * @param {string} id - The id of the playlist.
	 * @returns {Promise<unknown>} Information about the playlist.
	 */
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
	 * Searches for a video.
	 * @param {string} input - The entry to search for.
	 * @param {number} limit - The maximium amount of results to return.
	 * @returns {Promise<Result>} The results.
	 */
	public async search(query: string, limit: number): Promise<Result> {
		const filters = await ytsr.getFilters(query);
		const filteredURL = filters.get('Type')?.get('Video');

		if (!filteredURL?.url) throw 'Could not find any videos';

		const data = await ytsr(filteredURL.url, {
			limit,
		});

		return data;
	}

	/**
	 * Get the id of a video by its url.
	 * @param {string} url - The url of the video.
	 * @returns {string} The id of the video.
	 */
	public id(url: string): string {
		let match = url.match(video);

		if (match && match.length > 1) {
			return match[4];
		}

		match = url.match(playlist);

		return url;
	}
}
