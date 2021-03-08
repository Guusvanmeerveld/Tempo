import { Collection } from 'discord.js';

const settings: GuildSettings = require(process.cwd() +
	'/src/config/settings.json');

import { GuildSettings, Setting } from '../models';
import Console from './console';
import { isEqual } from 'lodash';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';
import { join } from 'path';

interface FileSchema {
	settings: { [id: string]: GuildSettings };
}

export default class Settings {
	private guilds: Collection<string, GuildSettings>;
	private db: low.LowdbSync<FileSchema>;

	constructor() {
		const adapter = new FileSync<FileSchema>(
			join(process.cwd(), 'database/guilds.json')
		);
		this.db = low(adapter);
		this.guilds = new Collection();

		this.db.defaults({ settings: {} }).write();

		const settings = this.db.get('settings').value();
		for (const [key, value] of Object.entries(settings)) {
			this.guilds.set(key, value as GuildSettings);
		}

		Console.success('Retrieved data from database!');
	}

	/**
	 * Get the current settings for a certain guild, or get a specific guild settings value
	 * @param id - The guild id
	 * @param setting - [Optional] The setting to retrieve
	 */
	get(id: string, setting: Setting): number | string;
	get(id: string): GuildSettings;

	public get(id: string, setting?: Setting) {
		if (this.guilds.has(id)) {
			return this.guilds.get(id)!;
		}

		return setting ? settings[setting] : settings;
	}

	/**
	 * Set a setting for a specific guild
	 * @param id - The guild id
	 * @param setting - The setting to set
	 * @param value - The new value of the setting
	 */
	public set(id: string, setting: Setting, value: string | number) {
		const currentSettings = this.get(id);
		const newSettings: GuildSettings = { ...currentSettings, [setting]: value };

		if (isEqual(newSettings, settings)) {
			this.guilds.delete(id);
			this.db.get('settings').unset(id).write();
		} else {
			this.guilds.set(id, newSettings);
			this.db.get('settings').set(id, newSettings).write();
		}
	}
}
