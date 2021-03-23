const spotify = {
	id: process.env.SPOTIFY_ID,
	secret: process.env.SPOTIFY_SECRET,
};

import axios from 'axios';

import { Song } from '../../models';
import Console from '../console';
import { SpotifyAlbumAPI, SpotifySearchAPI, SpotifyTrackAPI } from '../../models/requests';

interface OAuth {
	token: string;
	created: number;
	expires: number;
}

type API = 'albums' | 'tracks';

const oauth = axios.create({ baseURL: 'https://accounts.spotify.com/api' });
const request = axios.create({ baseURL: 'https://api.spotify.com/v1' });

const regex = /(open\.spotify\.com\/(album|track)\/)([0-9A-Za-z_-]{22}).*/;

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

		const { data } = await oauth.post('/token', 'grant_type=client_credentials', {
			headers: {
				Authorization: `Basic ${this.token}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

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

		const { data } = await request('/search', {
			headers: {
				Authorization: `Bearer ${this.oauth.token}`,
			},
			params: {
				q: input,
				type: 'track',
				limit,
			},
		});

		return data;
	}

	get(api: 'tracks', id: string): Promise<SpotifyTrackAPI>;
	get(api: 'albums', id: string): Promise<SpotifyAlbumAPI>;

	public async get(api: API, id: string) {
		await this.getOAuth();

		const { data } = await request(`/${api}/${id}`, {
			headers: {
				Authorization: `Bearer ${this.oauth.token}`,
			},
		});

		if (!data) throw `Could not get ${api} ${id}.`;

		return data;
	}

	public id(url: string) {
		const stripped = url.split('?');
		const match = stripped[0].match(regex);

		if (match && match.length > 1) {
			return match[3];
		}

		return url;
	}

	public async info(url: string): Promise<Song> {
		const id = this.id(url);

		const song = await this.get('tracks', id);

		return {
			author: song.artists[0].name,
			date: new Date(song.album.release_date),
			url: song.external_urls.spotify,
			image: song.album.images[0].url,
			platform: 'spotify',
			title: song.name,
			length: song.duration_ms,
			// views: song,
		};
	}
}
