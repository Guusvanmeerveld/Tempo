import { localeString } from './locales';

export interface GuildSettings {
	prefix: string;
	volume: number;
	search_platform: string;
	role: string;
	language: localeString;
}

export enum Setting {
	Prefix = 'prefix',
	Role = 'role',
	Volume = 'volume',
	Search_Platform = 'search_platform',
	Language = 'language',
}
