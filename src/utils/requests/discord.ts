import { InteractionCallback, InteractionCallbackData, SlashCommand } from '@models/requests';

import axios from 'axios';

const request = axios.create({
	baseURL: 'https://discord.com/api/v8/',
});

class Discord {
	private id: string = process.env.APPLICATION_ID ?? '';
	private token: string = process.env.DISCORD ?? '';

	/**
	 * Respond to a Discord interaction.
	 * @param {string} id
	 * @param {string} token
	 * @param {string} response
	 */
	public static async interactions(
		id: string,
		token: string,
		response: InteractionCallbackData
	): Promise<unknown> {
		const body: InteractionCallback = { data: response, type: 4 };

		const { data } = await request(`interactions/${id}/${token}/callback`, {
			data: body,
			method: 'POST',
		});

		return data;
	}

	/**
	 * Updates a list of slash commands, each with a given id.
	 * @param id The id of the slash command to update
	 * @param updated The new slash command
	 * @returns Success
	 */
	public async bulkUpdateCommands(list: Array<SlashCommand>): Promise<Array<SlashCommand>> {
		const { data } = await request(`applications/${this.id}/commands`, {
			headers: {
				Authorization: `Bot ${this.token}`,
			},
			data: list,
			method: 'PUT',
		});

		return data;
	}
}

export default Discord;
