import { Message } from 'discord.js-light';

import { Setting, searchPlatform } from '@models/settings';
import { Command, Requirement } from '@models/command';
import { SlashOptionType } from '@models/requests';
import { DefaultEmbed } from '@models/embed';
import { languageDefs } from '@models/locales';
import { ucFirst } from '@utils/functions';
import { MAX_VOLUME } from './volume';
import Bot from '../bot';

const ROLE_MENTION = /(<@&)([0-9]{18})(>)/;

export class Settings implements Command {
	name = 'settings';
	description = 'Change the way the bot behaves.';
	usage = 'settings [setting to change] [new value of the setting]';
	aliases = ['set'];
	requirements: Requirement[] = ['ROLE'];
	options = [
		{
			type: SlashOptionType.STRING,
			name: 'setting',
			description: 'The setting to change.',
			choices: [
				{
					name: 'Prefix',
					value: 'prefix',
				},
				{
					name: 'Volume',
					value: 'volume',
				},
				{
					name: 'Language',
					value: 'language',
				},
				{
					name: 'Role',
					value: 'role',
				},
				{
					name: 'Searchplatform',
					value: 'search_platform',
				},
			],
		},
		{
			type: SlashOptionType.STRING,
			name: 'value',
			description: 'The new value of the setting.',
		},
	];

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	run(msg: Message, args: Array<string>): void {
		if (args.length < 1) {
			msg.channel.send(this.getSettingsEmbed(msg));
			return;
		}

		const input = args[0].toLocaleLowerCase();

		const choices = this.options[0].choices!;
		const foundOption = choices.find((option) => option.name.toLocaleLowerCase() === input);

		if (foundOption) {
			if (args.length < 2) {
				msg.channel.send('Please re-enter with a new value.');
				return;
			}

			let pretty = args[1].toLowerCase();
			let value: string | number = pretty;

			switch (input) {
				case Setting.Volume:
					value = parseInt(pretty.replace('%', ''));
					if (isNaN(value) || value < 0 || value > MAX_VOLUME) {
						msg.channel.send(
							`❌  That is not a valid number. Please specify a number between 0% - ${MAX_VOLUME}%.`
						);
						return;
					}

					pretty = value + '%';
					break;

				case Setting.Language:
					const lang = languageDefs.find((lang) => lang.name === value);

					if (!lang) {
						msg.channel.send('❌  That is not a valid language.');
						return;
					}

					value = lang.value;
					pretty = lang.name;
					break;

				case Setting.Role:
					const match = value.match(ROLE_MENTION);

					if (!match) {
						if (value === 'none') {
							value = 0;
						} else {
							msg.channel.send('❌  That is not a valid role.');
							return;
						}
					} else {
						value = match[2];
						pretty = msg.guild?.roles.resolve(value)?.toString() ?? 'None';
					}

					break;
			}

			this.client.settings.set(msg.guild?.id ?? '', input as Setting, value);

			msg.channel.send(`✅  Set the setting \`${input}\` to ${pretty}.`, {
				allowedMentions: { users: [] },
			});
			return;
		}

		msg.channel.send('❌  That is not a valid setting.');
	}

	private getSettingsEmbed(msg: Message) {
		const settings = this.client.settings.get(msg.guild?.id);
		const embed = new DefaultEmbed(msg.author);

		embed.setTitle(`🛠️  Current settings for \`${msg.guild?.name ?? 'Unknown guild'}\``);

		const role = msg.guild?.roles.resolve(settings.role)?.toString() ?? 'None';
		const language = languageDefs.find((lang) => lang.value === settings.language);

		embed.addFields(
			{
				name: 'Prefix',
				value: `\`${settings.prefix}\``,
				inline: true,
			},
			{
				name: 'Language',
				value: `${ucFirst(language?.name ?? '')}`,
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

		return { allowedMentions: { users: [] }, embed };
	}
}
