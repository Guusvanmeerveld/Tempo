import { Command, DefaultEmbed, PaginatedEmbed } from '../models';
import { EmbedField, Message } from 'discord.js';
import Bot from '../bot';
import { ucFirst } from '../utils/functions';

export class Help implements Command {
	name = 'help';
	aliases = ['h'];
	usage = 'help [page / command]';
	description = 'Get information about a specific command or just a general list of commands.';

	public run(msg: Message, args: Array<string>, client: Bot) {
		const commands = client.commands.array();
		const settings = client.settings.get(msg.guild?.id ?? '');

		let embed: DefaultEmbed | PaginatedEmbed;

		if (args.length < 1) {
			embed = new DefaultEmbed(msg.author);

			embed.setTitle('Showing all commands for Tempo');
			embed.setDescription(
				`The current prefix for Tempo in \`${msg.guild!.name}\` is \`${settings.prefix}\`.`
			);

			commands.forEach((cmd) => embed.addField(ucFirst(cmd.name), cmd.description ?? '', true));
		} else if (parseInt(args[0])) {
			const fields: Array<EmbedField> = commands.map((cmd: Command) => {
				return {
					name: `\`${settings.prefix + cmd.name}\``,
					value: `
					${cmd.description}${cmd.aliases ? `\nAliases: \`${cmd.aliases?.join(', ')}\`` : ''}\nUsage: \`${
						cmd.usage
					}\``,
					inline: false,
				};
			});

			embed = new PaginatedEmbed({
				author: msg.author,
				args,
				fields,
			});

			embed.setTitle('List of commands for Tempo');
		} else {
			const command = commands.find((f) => f.name.match(args[0]));

			const name = ucFirst(command?.name ?? '');
			const aliases = command?.aliases?.join(', ');
			const requirements = command?.requirements?.map((g) => `\`${ucFirst(g)}\``).join(' & ');

			embed = new DefaultEmbed(msg.author);

			embed.setDescription(command?.description);

			embed.addFields(
				{
					name: 'Aliases',
					value: `\`${aliases ?? 'None'}\``,
					inline: true,
				},
				{
					name: 'Requirements',
					value: `Requires ${requirements ?? '`None`'}`,
					inline: true,
				},
				{
					name: 'Usage',
					value: command?.usage ?? 'No usage',
					inline: true,
				}
			);

			embed.setTitle(name);
		}

		msg.channel.send(embed);
	}
}
