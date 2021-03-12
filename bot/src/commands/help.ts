import { Command, PaginatedEmbed } from '../models';
import { EmbedField, Message } from 'discord.js';
import Bot from '../bot';

export class Help implements Command {
	name: string;
	aliases: Array<string>;
	description: string;

	constructor() {
		this.name = 'help';
		this.aliases = ['h'];
		this.description =
			'Get information about a specific command or just a general list of commands.';
	}

	public run(msg: Message, args: Array<string>, client: Bot) {
		const commands = client.commands.array();
		const settings = client.settings.get(msg.guild?.id ?? '');

		const fields: Array<EmbedField> = commands.map((cmd: Command) => {
			return {
				name: `\`${settings.prefix + cmd.name}\``,
				value: `${cmd.description}${
					cmd.aliases ? `\nAliases: \`${cmd.aliases?.join(', ')}\`` : ''
				}`,
				inline: false,
			};
		});

		const embed = new PaginatedEmbed({
			author: msg.author,
			args,
			fields,
		});
		embed.setTitle('List of commands for Tempo');

		msg.channel.send(embed);
	}
}
