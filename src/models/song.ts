import { User } from 'discord.js';

export interface Song {
	platform: 'soundcloud' | 'youtube' | 'spotify' | 'audio';
	title: string;
	author: string;
	image: string;
	date: Date;
	url: string;
	views?: number;
	likes?: number;
	dislikes?: number;
	download?: string;
	requested?: User;
}
