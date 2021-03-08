import { Client } from 'pg';

export class Database {
	client: Client;
	constructor() {
		this.client = new Client({
			connectionString: process.env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false,
			},
		});
	}

	public connect() {
		this.client.connect();
	}

	public query() {
		this.client.query(
			'SELECT table_schema,table_name FROM information_schema.tables;',
			(err, res) => {
				if (err) throw err;

				for (let row of res.rows) {
					console.log(JSON.stringify(row));
				}

				this.client.end();
			}
		);
	}
}
