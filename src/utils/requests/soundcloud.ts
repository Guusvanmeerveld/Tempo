const soundcloudToken = process.env.SOUNDCLOUD;

import { SoundCloudSearchAPI, SoundCloudTrackAPI } from '@models/requests';

import axios from 'axios';
import m3u8stream, { Stream } from 'm3u8stream';

const request = axios.create({
	baseURL: 'https://api-v2.soundcloud.com/',
	params: { client_id: soundcloudToken },
});

export default class SoundCloud {
	public async track(url: string): Promise<SoundCloudTrackAPI> {
		const { data } = await request('/resolve', {
			params: {
				url,
			},
		});

		return data;
	}

	public async search(entry: string, limit: number): Promise<SoundCloudSearchAPI> {
		const { data } = await request('/search/tracks', {
			params: {
				q: entry,
				limit,
			},
		});

		return data;
	}

	public async download(url: string | undefined): Promise<Stream> {
		if (!url) throw 'No url given';
		const downloadURL = (await request(url)).data.url;

		return m3u8stream(downloadURL);
	}
}
