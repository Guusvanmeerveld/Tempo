import { Message } from 'discord.js';
import Bot from '../bot';
import { Command, DefaultEmbed, Requirement, Setting } from '../models';
import { MAX_VOLUME } from './volume';

import fs from 'fs';
import { join } from 'path';
import { ucFirst } from '../utils/functions';

let languages: Array<string> = [];

const files = fs.readdirSync(join(process.cwd(), 'src/config/lang/'));
languages = files.map((g) => g.replace('.json', ''));

export class Settings implements Command {
	name: string;
	description: string;
	aliases: Array<string>;
	requirements: Array<Requirement>;

	constructor() {
		this.name = 'settings';
		this.description = 'Change the way the bot behaves.';
		this.aliases = ['set'];
		this.requirements = ['ROLE'];
	}

	run(msg: Message, args: Array<string>, client: Bot) {
		if (args.length < 1) {
			const settings = client.settings.get(msg.guild!.id);
			const embed = new DefaultEmbed(msg.author);

			embed.setTitle(`🛠️  Current settings for \`${msg.guild!.name}\``);

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

				case Setting.Language:
					if (!languages.includes(value)) {
						msg.channel.send('❌  That is not a valid language.');
						return;
					}

					break;
			}

			client.settings.set(msg.guild!.id, input, value);

			msg.channel.send(`✅  Set the setting \`${input}\` to \`${value}\`.`);
			return;
		}

		msg.channel.send('❌  That is not a valid setting.');
	}
}
