import { Message } from 'discord.js-light';
import Bot from '../bot';
import { Command, Requirement } from '../models';

import { Play } from './index';

export class PlaySkip implements Command {
	name = 'playskip';
	description = 'Skip and play a new song.';
	usage = 'playskip [name of song / link to song]';
	aliases = ['ps'];
	requirements: Requirement[] = ['ROLE', 'VOICE'];

	private play = new Play();

	run(msg: Message, args: Array<string>, client: Bot) {
		this.play.run(msg, args, client, true);
	}
}
