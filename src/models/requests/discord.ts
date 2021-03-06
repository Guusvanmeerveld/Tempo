import { MessageEmbed } from 'discord.js-light';

export interface InteractionCreate {
	version: number;
	type: number;
	token: string;
	member: Member;
	id: string;
	guild_id: string;
	data: Data;
	channel_id: string;
	application_id: string;
}

interface Data {
	options: Option[];
	name: string;
	id: string;
}

interface Option {
	value: string;
	type: number;
	name: string;
}

interface Member {
	user: User;
	roles: string[];
	premium_since: null;
	permissions: string;
	pending: boolean;
	nick: string;
	mute: boolean;
	joined_at: string;
	is_pending: boolean;
	deaf: boolean;
}

interface User {
	username: string;
	public_flags: number;
	id: string;
	discriminator: string;
	avatar: string;
}

export interface InteractionCallback {
	type: number;
	data: InteractionCallbackData;
}

export interface InteractionCallbackData {
	embeds?: Array<MessageEmbed>;
	content?: string;
}

export interface SlashCommand {
	id?: string;
	application_id?: string;
	options?: Array<SlashCommandOption>;
	name: string;
	description: string;
}

export enum SlashOptionType {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
}

export interface SlashOptionChoice {
	name: string;
	value: number | string;
}

interface SlashCommandOption {
	type: number;
	name: string;
	description: string;
	required?: boolean;
}
