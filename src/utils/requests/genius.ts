import axios from 'axios';
import cio from 'cheerio';

import { SearchHit } from '@models/requests';

const request = axios.create({
	baseURL: 'https://api.genius.com',
	params: {
		access_token: process.env.GENIUS,
	},
});

interface BasicSongInfo {
	lyrics?: string;
	url: string;
	title: string;
	image: string;
}

export default class Genius {
	/**
	 * Search the lyrics for a song on Genius.
	 * @param {string} entry - The entry to search for.
	 * @returns {Promise<BasicSongInfo>} Some basic info about the song (including lyrics).
	 */
	public static async search(entry: string): Promise<BasicSongInfo> {
		const { data } = await request('/search', {
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

		if (!lyrics) throw `Could not get lyrics from this url: ${url}`;

		return {
			lyrics,
			url,
			title: song.result.full_title,
			image: song.result.header_image_thumbnail_url,
		};
	}

	/**
	 * Gets the lyrics from a Genius url.
	 * @param {string} url - The Genius url where the lyrics can be found.
	 * @returns {string} The lyrics found at the url.
	 */
	public static async lyrics(url: string): Promise<string | void> {
		const { data } = await axios.get(url);

		const $ = cio.load(data);

		let lyrics = $('[class*=Lyrics__Root], .lyrics')
			.html()
			?.replace(/\n/g, '')
			.replace(/<br>/g, '\n')
			.replace(/<(?:.|\n)*?>/gm, '');

		if (!lyrics) return;

		if (lyrics.length >= 2048) lyrics = lyrics.slice(0, 2048);

		return lyrics;
	}
}
