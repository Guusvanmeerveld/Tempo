import { Pool, QueryConfig } from 'pg';
import { GuildSettings } from '../models';
import Console from './console';

export interface RawDBData {
	id: string;
	settings: GuildSettings;
}

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

	public async get(): Promise<Array<RawDBData>> {
		const query = await this.pool.query(`SELECT * FROM guilds`);

		return query.rows;
	}

	public delete(id: string): void {
		this.pool.query(`DELETE FROM guilds WHERE id = $1`, [id]);
	}

	public set(id: string, settings: GuildSettings): void {
		const query: QueryConfig = {
			name: 'insert/update-guild',
			text: `INSERT INTO guilds(id, settings) VALUES($1, $2) ON CONFLICT (id) DO UPDATE SET id = $1, settings = $2`,
			values: [id, settings],
		};

		this.pool.query(query);
	}
}
