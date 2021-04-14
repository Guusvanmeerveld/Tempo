import { config } from 'dotenv';
config();

import Discord from './bot/utils/requests/discord';

const discord = new Discord();

import * as commands from './bot/commands';
import { Command } from './bot/models';
import { SlashCommand } from './bot/models/requests';

import Console from './bot/utils/console';
import Bot from 'bot/bot';

export const updateSlash = async (client: Bot) => {
	const localCommands: Array<Command> = Object.values(commands).map(
		(Command) => new Command(client)
	);
	const slashCommands: Array<SlashCommand> = [];

	localCommands.forEach((command) => {
		const name = command.name.replace(/\s/g, '');

		slashCommands.push({
			description: command.description,
			options: command.options,
			name,
		});
	});

	discord
		.bulkUpdateCommands(slashCommands)
		.then(() => Console.success(`Successfully updated ${slashCommands.length} commands!`))
		.catch((err) => Console.error(`Failed to update commands: ${err}`));
};
