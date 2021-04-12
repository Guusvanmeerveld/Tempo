const soundcloudToken = process.env.SOUNDCLOUD;

import { Song } from '@models/index';
import { SoundCloudSearchAPI, SoundCloudTrackAPI } from '@models/requests';

import axios from 'axios';
import m3u8stream, { Stream } from 'm3u8stream';

const request = axios.create({
	baseURL: 'https://api-v2.soundcloud.com/',
	params: { client_id: soundcloudToken },
});

export default class SoundCloud {
	public async track(url: string): Promise<SoundCloudTrackAPI> {
		return (
			await request('/resolve', {
				params: {
					url,
				},
			})
		).data;
	}

	public async search(entry: string, limit: number): Promise<SoundCloudSearchAPI> {
		return (
			await request('/search/tracks', {
				params: {
					q: entry,
					limit,
				},
			})
		).data;
	}

	public async download(url: string | undefined): Promise<Stream> {
		if (!url) throw 'No url given';
		const downloadURL = (await request(url)).data.url;

		return m3u8stream(downloadURL);
	}

	public async info(input: string): Promise<Song> {
		const data = await this.track(input);

		return {
			platform: 'soundcloud',
			title: data.title,
			date: new Date(data.created_at),
			author: data.publisher_metadata?.artist ?? 'Unknown artist',
			image: data.artwork_url,
			url: data.permalink_url,
			download: data.media?.transcodings[0].url,
			likes: data.likes_count,
			views: data.playback_count,
			length: data.duration,
		};
	}
}
