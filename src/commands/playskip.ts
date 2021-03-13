import { Message } from 'discord.js-light';
import Bot from '../bot';
import { Command, Requirement } from '../models';

import { Play } from './index';

export class PlaySkip implements Command {
	name: string;
	description: string;
	aliases: Array<string>;
	play: Play;
	requirements: Array<Requirement>;

	constructor() {
		this.name = 'playskip';
		this.description = 'Skip and play a new song.';
		this.aliases = ['ps'];
		this.requirements = ['ROLE', 'VOICE'];

		this.play = new Play();
	}

	run(msg: Message, args: Array<string>, client: Bot) {
		this.play.run(msg, args, client, true);
	}
}
