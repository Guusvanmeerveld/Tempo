import { VoiceChannel, Message } from 'discord.js-light';

import { Command, Requirement } from '@models/command';
import Bot from '../bot';

export class Join implements Command {
	name = 'join';
	aliases = ['j', 'summon', 'connect'];
	usage = 'join';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	description = 'Make the bot join the voice channel.';

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	public async run(msg: Message): Promise<boolean | void> {
		const channel = (await msg.member?.voice.channel?.fetch()) as VoiceChannel;

		if (channel.members.get(this.client.user?.id ?? '') && msg.guild?.voice?.connection) {
			const voiceChannel = (await msg.guild?.voice?.channel?.fetch()) as VoiceChannel;
			msg.channel.send(`🔈  Connected to \`${voiceChannel.name}\``);
			return true;
		}

		const user = msg.client.user;
		if (!user) return;

		const channelPerms = channel?.permissionsFor(user);

		if (!channelPerms?.has('VIEW_CHANNEL')) {
			msg.channel.send('❌  I am not allowed to view to your voice channel.');
			return;
		}

		if (!channelPerms?.has('CONNECT')) {
			msg.channel.send('❌  I am not allowed to connect to your voice channel.');
			return;
		}

		if (!channelPerms?.has('SPEAK')) {
			msg.channel.send('❌  I am not allowed to speak in your voice channel.');
			return;
		}

		if (
			channel.userLimit &&
			channel.userLimit <= channel.members.array().length &&
			!msg.guild?.me?.hasPermission('ADMINISTRATOR')
		) {
			msg.channel.send('❌  Your channel is too full for me to join.');
			return;
		}

		await channel?.join();
		msg.channel.send(`🔈  Successfully joined \`${channel.name ?? 'Unknown channel'}\`.`);

		return true;
	}
}
