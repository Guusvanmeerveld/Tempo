import { Message } from 'discord.js';
import { Command } from '../models';

export class Ping implements Command {
	name = 'ping';
	description = 'Ping the bot to get the latency.';

	run(msg: Message) {
		msg.channel.send(`💤  Pinging...`).then((sent) => {
			sent.edit(`🏓  Pong! Took \`${sent.createdTimestamp - msg.createdTimestamp}ms\``);
		});
	}
}
