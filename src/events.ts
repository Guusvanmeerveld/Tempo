import { Guild, Message, TextChannel, GuildChannel, VoiceState } from 'discord.js-light';

import { prefix } from '@config/settings.json';

import Bot from './bot';
import Long from 'long';
import Console from '@utils/console';
import { DefaultEmbed } from '@models/index';
import { InteractionCreate } from '@models/requests';

export default class Events {
	private client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	/**
	 * Runs when the bot detects a message that was sent
	 * @param msg - The message that was sent
	 */
	public async message(msg: Message): Promise<void> {
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

		const settings = this.client.settings.get(msg.guild.id);

		if (!msg.content.startsWith(settings.prefix)) {
			return;
		}

		const channel = (await msg.channel.fetch()) as TextChannel;
		const user = this.client.user!;

		const channelPerms = channel.permissionsFor(user);

		if (!channelPerms?.has('SEND_MESSAGES') || !channelPerms?.has('EMBED_LINKS')) {
			return;
		}

		const args: Array<string> = msg.content.slice(settings.prefix.length).split(/ +/);
		const commandInput: string = args.shift()!.toLowerCase();

		const command =
			this.client.commands.get(commandInput) ||
			this.client.commands.find((cmd) => cmd.aliases?.includes(commandInput) ?? false);

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
			command.run(msg, args);
		} catch (error) {
			this.error(error);
		}

		if (!this.client.queues.has(msg.guild!.id))
			this.client.queues.set(msg.guild!.id, { songs: [], loop: false });
	}

	/**
	 * Runs when the bot encounters an error
	 * @param error - The error that occured
	 */
	public error(error: Object) {
		this.client.users
			.fetch(process.env.OWNER ?? '')
			.then((owner) => owner.send('```json\n' + error + '```'));
	}

	/**
	 * Runs when the bot joins a new guild
	 * @param guild - The guild the bot has joined
	 */
	public async guildJoin(guild: Guild): Promise<void> {
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
					a.position - b.position || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber()
			)
			.first();

		if (!mainChannel) {
			Console.error('Was not able to find a channel where I could speak in guild: ' + guild.name);
			return;
		}

		const embed = new DefaultEmbed();

		embed.setTitle('Thanks for adding me!');
		embed.setDescription(
			`My default prefix is \`${prefix}\`.\n Below is a list of things you can check out when using the bot.`
		);

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
			},
			{
				name: 'Source code',
				value: 'https://github.com/guusvanmeerveld/tempo/',
			}
		);

		embed.setFooter('Made with ❤️ by Xeeon#7590');

		(mainChannel as TextChannel).send(embed);
	}

	public slash(interaction: InteractionCreate) {
		// Discord.interactions(interaction.id, interaction.token, {});
	}

	/**
	 * Runs when there is a voice state update
	 * @param oldState - The old state
	 * @param newState - The new state
	 */
	public voice(oldState: VoiceState, newState: VoiceState): void {
		if (oldState && oldState.member === oldState.guild.me) {
			if (oldState && !newState) this.handleDisconnect(oldState.guild);
		}
	}

	/**
	 * Runs when bot gets disconnected from a voice channel
	 * @param guild - The guild the bot was disconnected from
	 */
	private handleDisconnect(guild: Guild): void {
		const queue = this.client.queues.get(guild.id);
		if (!queue) return;

		queue.songs.length = 0;
		delete queue.playing;
	}
}
