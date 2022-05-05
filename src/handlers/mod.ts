import { Pool, PoolConfig, PoolClient } from "../types";
import Tags from "./tags";

const db = new Pool({
	max: parseInt(process.env.DATABASE_MAX_CONNECTION, 10) || 10,
	host: process.env.DATABASE_HOST || 'localhost',
	user: process.env.DATABASE_USER || '',
	password: process.env.DATABASE_PASSWD || '',
	database: process.env.DATABASE_NAME || 'postgres',
	idleTimeoutMillis: 30 * 1000,
	connectionTimeoutMillis: 5 * 1000,
});

async function closeDatabaseConnections() {
	await db.end();
}

const tags = new Tags(db);

export {
	closeDatabaseConnections,
	tags,
}
