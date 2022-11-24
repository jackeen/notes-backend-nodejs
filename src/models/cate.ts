/**
 *
 *
 */

import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

import { Logger } from "../logger";
import { Model } from "./model";


interface ICate {
	id: number;
	title: string;
	notesCount?: number;
}

class Cate extends Model {

	data: ICate;

	constructor(prop?: Map<string, any>) {
		super();
		if (prop) {
			this.data = {
				id: prop.get('id'),
				title: prop.get('title'),
			}
		}
	}

	private _formatResult(result: QueryResult): ICate[] {
		const list: ICate[] = [];
		if (result.rowCount !== 0) {
			result.rows.forEach((row: QueryResultRow) => {
				list.push({
					id: row.id,
					title: row.title,
					notesCount: row.notes_count,
				});
			});
		}
		return list;
	}

	async probeExistedByID(): Promise<boolean> {
		const sql = 'select exists (select id from cates where id=$1) as existed';
		const result = await this.pool.query(sql, [this.data.id]);
		if (result.rows[0].existed) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async probeExistedByTitle(): Promise<boolean> {
		const sql = 'select exists (select id from cates where title=$1) as existed';
		const result = await this.pool.query(sql, [this.data.title]);
		if (result.rows[0].existed) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async getAll(): Promise<ICate[]> {
		const sql = 'select * from cates order by id';
		const result = await this.pool.query(sql);
		return Promise.resolve(this._formatResult(result));
	}

	async getAllWithNotesCount(): Promise<ICate[]> {
		const sql = `
			select cates.id, cates.title, count(notes.id)::Integer as notes_count
			from cates
			left join notes
			on cates.id = notes.cate_id
			group by cates.id
			order by cates.id;
		`;
		const result = await this.pool.query(sql);
		return Promise.resolve(this._formatResult(result));
	}

	async insert(): Promise<number> {
		const sql = 'insert into cates (title) values ($1) returning id';
		const result = await this.pool.query(sql, [this.data.title]);
		return Promise.resolve(result.rows[0].id);
	}

	async update() {
		const sql = 'update cates set title=$1 where id=$2';
		await this.pool.query(sql, [this.data.title, this.data.id]);
	}

	async remove() {
		const sql = 'delete from cates where id=$1';
		await this.pool.query(sql, [this.data.id]);
	}

}


export {
	ICate,
	Cate,
}