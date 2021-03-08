import { Message } from 'discord.js';
import Bot from '../bot';
import { Command } from '../models';

export class Invite implements Command {
	name: string;
	description: string;
	aliases: Array<string>;
	constructor() {
		this.name = 'invite';
		this.description = 'Generate a link to invite this bot to a server.';
		this.aliases = ['inv'];
	}

	public run(msg: Message, args: Array<string>, client: Bot) {
		client
			.generateInvite({
				permissions: [
					'CONNECT',
					'SPEAK',
					'SEND_MESSAGES',
					'EMBED_LINKS',
					'ADD_REACTIONS',
				],
			})
			.then((invite) =>
				msg.channel.send(`Heres a link to invite me to a server: ${invite}`)
			);
	}
}
