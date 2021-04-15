import { config } from 'dotenv';
config();

import { SlashCommand } from '@models/requests';
import Discord from './utils/requests/discord';
import { Command } from '@models/index';
import * as commands from './commands';
import Console from '@utils/console';
import Bot from './bot';

const discord = new Discord();

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
