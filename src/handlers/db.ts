import { Pool, PoolConfig, PoolClient } from "pg";
import Tags from "./tags";

interface Note {
	id: number;
	title?: string;
	contents?: string;
	poster?: string;
	createDate: Date;
	editDate: Date;
	cateId: number;
	isDraft: boolean;
}

interface Cate {
	id: number;
	title: string;
}

interface Tag {
	id: number;
	title: string;
}

interface Image {
	id: number;
	title: string;
	width: number;
	height: number;
	fileSize: number;
	fileName: string;
	filePath: string;
	fileType: string;
	groupId: number;
}

interface ImageGroup {
	id: number;
	title: string;
	total: number;
}

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

export type {Note, Tag, Cate, Image, ImageGroup};
export {
	closeDatabaseConnections,
	tags,
}
