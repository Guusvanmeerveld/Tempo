import { Command, Requirement } from '../models';
import { User, VoiceChannel, Message } from 'discord.js-light';
import Bot from '../bot';

export class Join implements Command {
	name = 'join';
	aliases = ['j', 'summon', 'connect'];
	usage = 'join';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	description = 'Make the bot join the voice channel.';

	public async run(msg: Message, args: Array<string>, client: Bot) {
		const channel = (await msg.member?.voice.channel?.fetch()) as VoiceChannel;

		if (channel.members.get(client.user?.id ?? '') && msg.guild?.voice?.connection) {
			const guildChannel = (await msg.guild?.voice?.channel?.fetch()) as VoiceChannel;
			msg.channel.send(`🔈  Connected to \`${guildChannel.name}\``);
			return;
		}

		const user = msg.client.user as User;

		const channelPerms = channel?.permissionsFor(user);

		if (!channel.joinable) {
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

			if (channel.userLimit && channel.userLimit <= channel.members.array().length) {
				msg.channel.send('❌  Your channel is too full for me to join.');
				return;
			}

			msg.channel.send(
				'❌  An unknown error occured while trying to join. Please try again later.'
			);

			return;
		}

		await channel?.join();
		msg.channel.send(`🔈  Successfully joined \`${channel.name ?? 'Unknown channel'}\`.`);

		return true;
	}
}
