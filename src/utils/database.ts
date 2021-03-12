import { Pool } from 'pg';
import { GuildSettings } from '../models';
import Console from './console';

export interface DbData extends GuildSettings {
	id: string;
}

const INSERT_GUILDS =
	'INSERT INTO guilds(id, prefix, search_platform, volume, role, language) VALUES($1, $2, $4, $6, $5, $3)';

const ON_CONFLICT =
	'ON CONFLICT (id) DO UPDATE SET id=$1, prefix=$2, search_platform=$4, volume=$6, role=$5, language=$3';

export class Database {
	private pool: Pool;
	constructor() {
		this.pool = new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false,
			},
		});

		this.pool.on('error', (err, client) => {
			Console.error('Unexpected error on idle client' + JSON.stringify(err));
		});
	}

	public async get(): Promise<Array<DbData>> {
		const query = await this.pool.query(`SELECT * FROM guilds`);

		return query.rows;
	}

	public delete(id: string): void {
		this.pool.query(`DELETE FROM guilds WHERE id = $1`, [id]);
	}

	public set(id: string, settings: GuildSettings): void {
		const newSettings = [id, ...Object.values(settings)];

		const query = {
			name: 'insert/update-guild',
			text: `${INSERT_GUILDS} ${ON_CONFLICT}`,
			values: newSettings,
		};

		this.pool.query(query);
	}
}
