import { Message } from 'discord.js-light';

import { Command } from '@models/index';

export class Invite implements Command {
	name = 'invite';
	description = 'Generate a link to invite this bot to a server.';
	usage = 'invite';
	aliases = ['inv'];

	public run(msg: Message) {
		msg.client
			.generateInvite({
				permissions: ['CONNECT', 'SPEAK', 'SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
			})
			.then((invite) => msg.channel.send(`Heres a link to invite me to a server: ${invite}`));
	}
}
