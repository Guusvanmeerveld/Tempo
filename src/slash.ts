import { config } from 'dotenv';
config();

import Discord from './bot/utils/requests/discord';

const discord = new Discord();

import * as commands from './bot/commands';
import { Command } from 'bot/models';
import { SlashCommand } from 'bot/models/requests';

import Console from './bot/utils/console';

const main = async () => {
	const localCommands: Array<Command> = Object.values(commands).map((Command) => new Command());
	const slashCommands: Array<SlashCommand> = [];

	localCommands.forEach((command) => {
		const name = command.name.replace(/\s/g, '');

		slashCommands.push({
			description: command.description,
			name,
		});
	});

	discord
		.bulkUpdateCommands(slashCommands)
		.then(() => Console.success(`Successfully updated ${slashCommands.length} commands!`))
		.catch((err) => Console.error(`Failed to update commands: ${err}`));
};

main();
