const spotify = {
	id: process.env.SPOTIFY_ID,
	secret: process.env.SPOTIFY_SECRET,
};

import { Song } from '../../models';
import axios from 'axios';
import Console from '../console';
import { SpotifySearchAPI, SpotifyTrackAPI } from '../../models/requests';

interface OAuth {
	token: string;
	created: number;
	expires: number;
}

const oauth = axios.create({ baseURL: 'https://accounts.spotify.com/api' });
const request = axios.create({ baseURL: 'https://api.spotify.com/v1' });

const regex = /(open\.spotify\.com\/track\/)([0-9A-Za-z_-]{22})/;

export default class Spotify {
	oauth: OAuth;
	token: string;
	constructor() {
		const tokenCombo = `${spotify.id}:${spotify.secret}`;
		this.token = Buffer.from(tokenCombo).toString('base64');

		this.oauth = {
			token: '',
			expires: 0,
			created: 0,
		};
	}

	private async getOAuth() {
		if (this.oauth.created) {
			const expired = Date.now() - this.oauth.created > this.oauth.expires * 1000;

			if (!expired) return;
		}

		const data = (
			await oauth.post('/token', 'grant_type=client_credentials', {
				headers: {
					Authorization: `Basic ${this.token}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
		).data;

		Console.success('Got new OAuth token from Spotify');

		const oauthToken: OAuth = {
			token: data.access_token,
			expires: data.expires_in,
			created: Date.now(),
		};

		this.oauth = oauthToken;
	}

	public async search(input: string, limit: number): Promise<SpotifySearchAPI> {
		await this.getOAuth();

		return (
			await request('/search', {
				headers: {
					Authorization: `Bearer ${this.oauth.token}`,
				},
				params: {
					q: input,
					type: 'track',
					limit,
				},
			})
		).data;
	}

	public async track(id: string): Promise<SpotifyTrackAPI> {
		await this.getOAuth();

		return (
			await request(`/tracks/${id}`, {
				headers: {
					Authorization: `Bearer ${this.oauth.token}`,
				},
			})
		).data;
	}

	public id(url: string) {
		const match = url.match(regex);

		if (match && match.length > 1) {
			return match[2];
		}

		return url;
	}

	public async info(url: string): Promise<Song> {
		const id = this.id(url);

		const song = await this.track(id);

		return {
			author: song.artists[0].name,
			date: new Date(song.album.release_date),
			url: song.external_urls.spotify,
			image: song.album.images[0].url,
			platform: 'spotify',
			title: song.name,
			// views: song,
		};
	}
}
