import { Message } from 'discord.js-light';
import { Command } from '@models/index';

export class Ping implements Command {
	name = 'ping';
	usage = 'ping';
	description = 'Ping the bot to get the latency.';

	run(msg: Message): void {
		msg.channel.send('💤  Pinging...').then((sent) => {
			sent.edit(`🏓  Pong! Took \`${sent.createdTimestamp - msg.createdTimestamp}ms\``);
		});
	}
}
