/**
 *
 *
 */

import { QueryResult, QueryResultRow } from "pg";

import { Model } from "./model";
import { Logger } from "../logger";


interface ITag {
	id: number;
	title: string;
}

class Tag extends Model{

	data: ITag;

	constructor(prop?: Map<string, any>) {
		super();
		if (prop) {
			this.data = {
				id: prop.get('id'),
				title: prop.get('title'),
			}
		}
	}

	private _formatResult(result: QueryResult): ITag[] {
		const list: ITag[] = [];
		if (result.rowCount !== 0) {
			result.rows.forEach((row: QueryResultRow) => {
				list.push({
					id: row.id,
					title: row.title,
				});
			});
		}
		return list;
	}

	async probeExistedByID(): Promise<boolean> {
		const sql = 'select exists (select id from tags where id=$1) as existed';
		const result = await this.pool.query(sql, [this.data.id]);
		if (result.rows[0].existed) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async probeExistedByTitle(): Promise<boolean> {
		const sql = 'select exists (select id from tags where title=$1) as existed';
		const result = await this.pool.query(sql, [this.data.title]);
		if (result.rows[0].existed) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async getAll(): Promise<ITag[]> {
		const sql = 'select * from tags order by id';
		const result = await this.pool.query(sql);
		return Promise.resolve(this._formatResult(result));
	}

	async insert(): Promise<number> {
		const sql = 'insert into tags (title) values ($1) returning id';
		const result = await this.pool.query(sql, [this.data.title]);
		return Promise.resolve(result.rows[0].id);
	}

	async update() {
		const sql = 'update tags set title=$1 where id=$2';
		await this.pool.query(sql, [this.data.title, this.data.id]);
	}

	async remove() {
		const sql = 'delete from tags where id=$1';
		await this.pool.query(sql, [this.data.id]);
	}
}


export {
	ITag,
	Tag,
}