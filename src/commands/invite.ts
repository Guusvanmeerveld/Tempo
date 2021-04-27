import { Message, PermissionResolvable } from 'discord.js-light';

import { Command } from '@models/command';

import { botPermissions } from '@config/global.json';

export class Invite implements Command {
	name = 'invite';
	description = 'Generate a link to invite this bot to a server.';
	usage = 'invite';
	aliases = ['inv'];

	public run(msg: Message): void {
		msg.client
			.generateInvite({
				permissions: botPermissions as PermissionResolvable,
			})
			.then((invite) => msg.channel.send(`Heres a link to invite me to a server: ${invite}`));
	}
}
