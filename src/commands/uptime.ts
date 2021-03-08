import { Command } from '../models';

import humanizeDuration from 'humanize-duration';
import { Message } from 'discord.js';
import Bot from '../bot';

export class Uptime implements Command {
	name: string;
	aliases: Array<string>;
	description: string;

	constructor() {
		this.name = 'uptime';
		this.aliases = ['up'];
		this.description = 'Get the uptime of the bot.';
	}

	run(msg: Message, args: Array<string>, client: Bot) {
		const time = humanizeDuration(client.uptime ?? 0);
		msg.channel.send(
			`Shard \`${msg.guild?.shardID ?? 0}\` has been online for ${time}.`
		);
	}
}
