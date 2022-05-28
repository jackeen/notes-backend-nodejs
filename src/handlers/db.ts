import { Pool, PoolConfig, PoolClient } from "pg";


const pool = new Pool({
	max: parseInt(process.env.DATABASE_MAX_CONNECTION, 10) || 10,
	host: process.env.DATABASE_HOST || 'localhost',
	user: process.env.DATABASE_USER || '',
	password: process.env.DATABASE_PASSWD || '',
	database: process.env.DATABASE_NAME || 'postgres',
	idleTimeoutMillis: 30 * 1000,
	connectionTimeoutMillis: 5 * 1000,
});


export {
	pool,
}
