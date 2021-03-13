import axios from 'axios';
import cio from 'cheerio';

const request = axios.create({
	baseURL: 'https://api.genius.com',
	params: {
		access_token: process.env.GENIUS,
	},
});

export interface SearchHit {
	type: string;
	result: {
		api_path: string;
		full_title: string;
		url: string;
	};
}

export default class Genius {
	public static async search(entry: string) {
		const { data } = await request(`/search`, {
			params: {
				q: entry,
			},
		});

		const songs = data.response.hits.filter((hit: SearchHit) => hit.type === 'song');

		const song: SearchHit = songs[0];
		if (!song) throw 'Could not find song';

		const url = song.result.url;
		if (!url) throw 'Unknown lyrics url';

		const lyrics = await this.lyrics(url);

		return { lyrics, url, title: song.result.full_title };
	}

	private static async lyrics(url: string) {
		const { data } = await axios.get(url);

		const $ = cio.load(data);

		let lyrics = $('[class*=Lyrics__Root], .lyrics')
			.html()
			?.replace(/\n/g, '')
			.replace(/<br>/g, '\n')
			.replace(/<(?:.|\n)*?>/gm, '');

		if (!lyrics || lyrics.length >= 2048) return;

		return lyrics;
	}
}
