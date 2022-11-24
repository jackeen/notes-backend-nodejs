/**
 *
 *
 */

 import { Pool, PoolConfig, PoolClient } from "pg";
 import { Logger } from "../logger";

 // https://node-postgres.com/
const pool = new Pool({
	max: parseInt(process.env.DATABASE_MAX_CONNECTION, 10) || 10,
	host: process.env.DATABASE_HOST || 'localhost',
	user: process.env.DATABASE_USER || '',
	password: process.env.DATABASE_PASSWD || '',
	database: process.env.DATABASE_NAME || 'notes',
	idleTimeoutMillis: 30 * 1000,
	connectionTimeoutMillis: 5 * 1000,
});


class Model {

	pool: Pool;
	properties: Map<string, any>;

	constructor() {
		this.pool = pool;
	}

	date2string(d: Date): string {
		const year = d.getFullYear();
		const month = d.getMonth() + 1;
		const day = d.getDate();
		return `${year}-${month}-${day}`;
	}

	string2date(s: string): Date {
		return new Date(s);
	}

}

export {
	Model,
}