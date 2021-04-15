import { Message } from 'discord.js-light';

import { Command, Requirement } from '@models/index';
import { Play } from './index';
import Bot from '../bot';

export class PlaySkip implements Command {
	name = 'playskip';
	description = 'Skip and play a new song.';
	usage = 'playskip [name of song / link to song]';
	aliases = ['ps'];
	requirements: Requirement[] = ['ROLE', 'VOICE'];

	client;
	private play;
	constructor(client: Bot) {
		this.client = client;
		this.play = new Play(client).run;
	}

	run(msg: Message, args: Array<string>) {
		this.play(msg, args, true);
	}
}
