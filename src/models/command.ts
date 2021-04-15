import { Message } from 'discord.js-light';

import Bot from '../bot';
import { SlashOptionChoice, SlashOptionType } from './requests';

export interface Command {
	name: string;
	description: string;
	usage: string;
	aliases?: Array<string>;
	requirements?: Array<Requirement>;
	options?: Array<CommandOption>;
	client?: Bot;
	run: (msg: Message, args: Array<string>) => void;
}

export type Requirement = 'ROLE' | 'VOICE';

interface CommandOption {
	name: string;
	description: string;
	type: SlashOptionType;
	required?: boolean;
	choices?: Array<SlashOptionChoice>;
	options?: Array<CommandOption>;
}
