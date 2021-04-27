const soundcloudToken = process.env.SOUNDCLOUD;

import { SoundCloudSearchAPI, SoundCloudTrackAPI } from '@models/requests';

import axios from 'axios';
import m3u8stream, { Stream } from 'm3u8stream';

const request = axios.create({
	baseURL: 'https://api-v2.soundcloud.com/',
	params: { client_id: soundcloudToken },
});

export default class SoundCloud {
	/**
	 * Get information about a track using its url.
	 * @param {string} url - The url of the track.
	 * @returns {Promise<SoundCloudTrackAPI>} Information about the track.
	 */
	public async track(url: string): Promise<SoundCloudTrackAPI> {
		const { data } = await request('/resolve', {
			params: {
				url,
			},
		});

		return data;
	}

	/**
	 * Searches for a track.
	 * @param {string} input - The entry to search for.
	 * @param {number} limit - The maximium amount of results to return.
	 * @returns {Promise<SoundCloudSearchAPI>} The results.
	 */
	public async search(entry: string, limit: number): Promise<SoundCloudSearchAPI> {
		const { data } = await request('/search/tracks', {
			params: {
				q: entry,
				limit,
			},
		});

		return data;
	}

	/**
	 * Get a m3u8 stream from a given url.
	 * @param {string} url - The url to get the stream from.
	 * @returns {Promise<Stream>} The stream.
	 */
	public async download(url: string | undefined): Promise<Stream> {
		if (!url) throw 'No url given';
		const downloadURL = (await request(url)).data.url;

		return m3u8stream(downloadURL);
	}
}
