import { Message } from 'discord.js-light';

import { Command, Requirement } from '@models/command';
import Bot from '../bot';

export class Loop implements Command {
	name = 'loop';
	usage = 'loop';
	description = 'Loops the current song until you turn it off.';
	requirements: Requirement[] = ['ROLE', 'VOICE'];

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	run(msg: Message): void {
		const queue = this.client.queues.get(msg.guild?.id ?? '');
		if (!queue) {
			msg.channel.send('❌  I am not connected to a voice channel');
			return;
		}

		const loop = queue.loop;

		queue.loop = !loop;
		msg.channel.send(`♾️  Loop is now ${!loop ? 'enabled' : 'disabled'}.`);
	}
}
