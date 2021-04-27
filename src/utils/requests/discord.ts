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
	 * @param {string} id - The id of the interaction.
	 * @param {string} token - The interactions token.
	 * @param {string} response - The response to the interaction.
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
	 * Overwrite the existing list of slash commands with the given new ones.
	 * @param {Array<SlashCommand>} updated - The list of the new slash commands.
	 * @returns {Promise<Array<SlashCommand>>} Success
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
