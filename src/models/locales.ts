import { ActivityType } from 'discord.js';

export default interface Locale {
	commands: Array<Command>;
	voice: {
		notConnected: string;
		disconnected: string;
	};
	bot: {
		activity: {
			type?: number | ActivityType;
			name: string;
		};
	};
}

export const languageDefs = [
	{
		name: 'nederlands',
		value: 'nl-NL',
	},
	{
		name: 'english',
		value: 'en-US',
	},
];

export type localeString = 'nl-NL' | 'en-US';

interface Command {
	name: string;
	description: string;
}
