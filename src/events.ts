import { Guild, Message, TextChannel, GuildChannel } from 'discord.js-light';

import Bot from './bot';
import Long from 'long';
import Console from './utils/console';
import { DefaultEmbed, Setting } from './models';

export async function handleMessage(msg: Message, client: Bot) {
	if (
		msg.partial ||
		msg.system ||
		msg.author.id === msg.client.user!.id ||
		msg.author.bot ||
		!msg.guild ||
		!msg.content
	) {
		return;
	}

	const settings = client.settings.get(msg.guild.id);

	if (!msg.content.startsWith(settings.prefix)) {
		return;
	}

	const channel = (await msg.channel.fetch()) as TextChannel;
	const user = client.user!;

	const channelPerms = channel.permissionsFor(user);

	if (!channelPerms?.has('SEND_MESSAGES') || !channelPerms?.has('EMBED_LINKS')) {
		return;
	}

	const args: Array<string> = msg.content.slice(settings.prefix.length).split(/ +/);
	const commandInput: string = args.shift()!.toLowerCase();

	const command =
		client.commands.get(commandInput) ||
		client.commands.find((cmd) => cmd.aliases?.includes(commandInput) ?? false);

	if (!command) return;

	if (command.requirements?.includes('VOICE') && !msg.member?.voice.channel) {
		msg.channel.send('You need to be connected to a voice channel to use this command.');
		return;
	}

	if (
		command.requirements?.includes('ROLE') &&
		parseInt(settings.role) &&
		!msg.member?.roles.cache.has(settings.role)
	) {
		const role = msg.guild.roles.resolve(settings.role);

		msg.channel.send(`You need to have the ${role?.toString()} role to use this command.`, {
			allowedMentions: { users: [] },
		});
		return;
	}

	try {
		command.run(msg, args, client);
	} catch (error) {
		handleError(error, client);
	}
}

export function handleError(error: Object, client: Bot) {
	client.users
		.fetch(process.env.OWNER ?? '')
		.then((owner) => owner.send('```json\n' + JSON.stringify(error) + '```'));
}

export async function handleGuildJoin(guild: Guild) {
	const user = guild.client.user!;

	const channels = await guild.channels.fetch();

	const mainChannel: GuildChannel | undefined = channels
		.filter((channel) => {
			const permissions = channel.permissionsFor(user);
			if (!permissions) return false;

			return channel.type === 'text' && permissions.has('SEND_MESSAGES');
		})
		.sort(
			(a, b) =>
				a.position - b.position ||
				Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber()
		)
		.first();

	if (!mainChannel) {
		Console.error(
			'Was not able to find a channel where I could speak in guild: ' + guild.name
		);
		return;
	}

	const embed = new DefaultEmbed();

	embed.setTitle('Thanks for adding me!');
	embed.setDescription('Below is a list of things you can check out when using the bot.');

	embed.addFields(
		{
			name: 'Discord server',
			value: 'https://discord.gg/v5Wx9RARGx',
		},
		{
			name: 'Website',
			value: 'https://tempo.g-vm.nl',
		},
		{
			name: 'List of commands',
			value: 'https://tempo.g-vm.nl/commands',
		},
		{
			name: 'Report bugs',
			value: 'https://tempo.g-vm.nl/bugs',
		}
	);

	embed.setFooter('Made with ❤️ by Xeeon#7590');

	(mainChannel as TextChannel).send(embed);
}
