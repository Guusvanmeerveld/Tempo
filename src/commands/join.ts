import { Command, Requirement } from '../models';
import { User, VoiceChannel, Message } from 'discord.js-light';
import Bot from '../bot';

export class Join implements Command {
	name: string;
	aliases: Array<string>;
	requirements: Array<Requirement>;
	description: string;

	constructor() {
		this.name = 'join';
		this.aliases = ['j', 'summon', 'connect'];
		this.requirements = ['VOICE'];
		this.description = 'Make the bot join the voice channel.';
	}

	public async run(msg: Message, args: Array<string>, client: Bot) {
		const memberChannel = (await msg.member?.voice.channel?.fetch()) as VoiceChannel;

		if (
			memberChannel.members.get(client.user?.id ?? '') &&
			msg.guild?.voice?.connection
		) {
			const guildChannel = (await msg.guild?.voice?.channel?.fetch()) as VoiceChannel;
			msg.channel.send(`🔈  Connected to \`${guildChannel.name}\``);
			return;
		}

		const user = msg.client.user as User;

		const channelPerms = memberChannel?.permissionsFor(user);

		if (!channelPerms?.has('CONNECT')) {
			msg.channel.send(
				'❌  I am not allowed to connect to your voice channel.'
			);
			return;
		}

		if (!channelPerms?.has('SPEAK')) {
			msg.channel.send('❌  I am not allowed to speak in your voice channel.');
			return;
		}

		client.queues.set(msg.guild?.id ?? '', { songs: [] });

		await memberChannel?.join();

		msg.channel.send(
			`🔈  Successfully joined \`${memberChannel.name ?? 'Unknown channel'}\`.`
		);
	}
}
