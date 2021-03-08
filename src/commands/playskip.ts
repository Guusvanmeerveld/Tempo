import { Message } from 'discord.js-light';
import Bot from '../bot';
import { Command } from '../models';

import { Play, Skip } from './index';

export class PlaySkip implements Command {
	name: string;
	description: string;
	aliases: Array<string>;
	play: Play;
	skip: Skip;

	constructor() {
		this.name = 'playskip';
		this.description = 'Skip and play a new song.';
		this.aliases = ['ps'];

		this.play = new Play();
		this.skip = new Skip();
	}

	run(msg: Message, args: Array<string>, client: Bot) {}
}
