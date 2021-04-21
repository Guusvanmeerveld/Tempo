import { localeString } from './locales';

export interface GuildSettings {
	prefix: string;
	volume: number;
	search_platform: searchPlatform;
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

export type searchPlatform = 'youtube' | 'soundcloud' | 'spotify';
