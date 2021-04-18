import { Message } from 'discord.js-light';

import { Command, DefaultEmbed, Requirement, Setting } from '@models/index';
import { ucFirst } from '@utils/functions';
import { MAX_VOLUME } from './volume';
import Bot from '../bot';

export class Settings implements Command {
	name = 'settings';
	description = 'Change the way the bot behaves.';
	usage = 'settings [setting to change] [new value of the setting]';
	aliases = ['set'];
	requirements: Requirement[] = ['ROLE'];
	// options = [
	// 	{
	// 		type: SlashOptionType.STRING,
	// 		name: 'setting',
	// 		description: 'The prefix for the current server.',
	// 		choices: [
	// 			{
	// 				name: 'prefix',
	// 				value: 'prefix',
	// 			},
	// 		],
	// 	},
	// 	{
	// 	}
	// ];

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	run(msg: Message, args: Array<string>): void {
		if (args.length < 1) {
			const settings = this.client.settings.get(msg.guild?.id);
			const embed = new DefaultEmbed(msg.author);

			embed.setTitle(`🛠️  Current settings for \`${msg.guild?.name ?? 'Unknown guild'}\``);

			const role = msg.guild?.roles.resolve(settings.role)?.toString() ?? 'None';

			embed.addFields(
				{
					name: 'Prefix',
					value: `\`${settings.prefix}\``,
					inline: true,
				},
				{
					name: 'Language',
					value: `${settings.language}`,
					inline: true,
				},
				{
					name: 'Search platform',
					value: `${ucFirst(settings.search_platform)}`,
					inline: true,
				},
				{
					name: 'Role',
					value: `${role}`,
					inline: true,
				},
				{
					name: 'Volume',
					value: `${settings.volume}%`,
					inline: true,
				}
			);

			msg.channel.send({ allowedMentions: { users: [] }, embed });
			return;
		}

		const input = args[0] as Setting;
		if (Object.values(Setting).includes(input)) {
			if (args.length < 2) {
				msg.channel.send('Please re-enter with a new value.');
				return;
			}

			let value: string | number = args[1];

			switch (input) {
				case Setting.Volume:
					value = parseInt(value.replace('%', ''));
					if (isNaN(value) || value < 0 || value > MAX_VOLUME) {
						msg.channel.send(
							`❌  That is not a valid number. Please specify a number between 0% - ${MAX_VOLUME}%.`
						);
						return;
					}

					break;

				// case Setting.Language:
				// 	if () {
				// 		msg.channel.send('❌  That is not a valid language.');
				// 		return;
				// 	}

				// 	break;
			}

			this.client.settings.set(msg.guild?.id ?? '', input, value);

			msg.channel.send(`✅  Set the setting \`${input}\` to \`${value}\`.`);
			return;
		}

		msg.channel.send('❌  That is not a valid setting.');
	}
}
