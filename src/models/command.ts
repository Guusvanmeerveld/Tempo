import { Message } from 'discord.js-light';
import Bot from '../bot';

export interface Command {
	name: string;
	description: string;
	usage?: string;
	aliases?: Array<string>;
	requirements?: Array<Requirement>;
	run: (msg: Message, args: Array<string>, client: Bot) => void;
}

export type Requirement = 'ROLE' | 'VOICE';
