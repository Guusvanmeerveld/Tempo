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
	data: {
		embeds?: Array<any>;
		content?: string;
	};
}

export interface SlashCommand {
	id?: string;
	application_id?: string;
	options?: Array<SlashCommandOption>;
	name: string;
	description: string;
}

interface SlashCommandOption {
	type: number;
	name: string;
	description: string;
	required?: boolean;
}
