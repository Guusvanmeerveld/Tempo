import { config } from 'dotenv';
config();

import Discord from './utils/requests/discord';

const discord = new Discord();

import * as commands from './commands';
import { Command } from '@models/index';
import { SlashCommand } from '@models/requests';

import Console from '@utils/console';
import Bot from './bot';

export const updateSlash = (client: Bot): void => {
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
