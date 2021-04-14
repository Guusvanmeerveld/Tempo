import { Command, Requirement } from '../models';
import { Message } from 'discord.js';
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

	run(msg: Message, args: Array<string>) {
		const queue = this.client.queues.get(msg.guild!.id);
		if (!queue) {
			msg.channel.send("❌  I'm not connected to a voice channel");
			return;
		}

		const loop = queue.loop;

		queue.loop = !loop;
		msg.channel.send(`♾️  Loop is now ${!loop ? 'enabled' : 'disabled'}.`);
	}
}
