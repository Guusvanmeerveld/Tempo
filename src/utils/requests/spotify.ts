const spotify = {
	id: process.env.SPOTIFY_ID,
	secret: process.env.SPOTIFY_SECRET,
};

import axios from 'axios';

import { SpotifyAlbumAPI, SpotifySearchAPI, SpotifyTrackAPI } from '@models/requests';

import Console from '@utils/console';

interface OAuth {
	token: string;
	created: number;
	expires: number;
}

type API = 'albums' | 'tracks';
type APIResponse = SpotifyTrackAPI | SpotifyAlbumAPI;

const oauth = axios.create({ baseURL: 'https://accounts.spotify.com/api' });
const request = axios.create({ baseURL: 'https://api.spotify.com/v1' });

const regex = /(open\.spotify\.com\/(album|track)\/)([0-9A-Za-z_-]{22}).*/;

export default class Spotify {
	private oauth: OAuth;
	private token: string;

	constructor() {
		const tokenCombo = `${spotify.id}:${spotify.secret}`;
		this.token = Buffer.from(tokenCombo).toString('base64');

		this.oauth = {
			token: '',
			expires: 0,
			created: 0,
		};
	}

	/**
	 * Check if the current oauth token has expired and request a new one if that is the case.
	 */
	private async getOAuth(): Promise<void> {
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

	/**
	 * Searches for a song.
	 * @param {string} input - The entry to search for.
	 * @param {number} limit - The maximium amount of results to return.
	 * @returns {Promise<SpotifySearchAPI>} The results.
	 */
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

	/**
	 * Get a n item from a given API by its id.
	 * @param {API} api - The API location to request from.
	 * @param {string} id - The id of the item that is requested.
	 * @returns {Promise<APIResponse>} The api's response.
	 */
	public async get(api: API, id: string): Promise<APIResponse> {
		await this.getOAuth();

		const { data } = await request(`/${api}/${id}`, {
			headers: {
				Authorization: `Bearer ${this.oauth.token}`,
			},
		});

		if (!data) throw `Could not get ${api} ${id}.`;

		return data;
	}

	/**
	 * Get the id of a song by its url.
	 * @param {string} url - The url of the song.
	 * @returns {string} The id of the song.
	 */
	public id(url: string): string {
		const stripped = url.split('?');
		const match = stripped[0].match(regex);

		if (match && match.length > 1) {
			return match[3];
		}

		return url;
	}
}
