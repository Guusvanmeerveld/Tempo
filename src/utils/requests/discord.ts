import axios from 'axios';

const request = axios.create({
	baseURL: 'https://discord.com/api/v8/',
	method: 'GET',
});

export default class Discord {
	public static async user(token: string) {
		const { data } = await request('/user/@me', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return data;
	}

	public static async exists(token: string) {
		const data = await this.user(token);

		return data !== undefined;
	}
}
