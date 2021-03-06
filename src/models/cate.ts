import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { Logger } from "../logger";


interface ICate {
	id: number;
	title: string;
}

class Cate implements ICate {

	pool: Pool;

	id: number;
	title: string;

	constructor(pool: Pool, cate?: ICate) {
		this.pool = pool;
		this.id = cate?.id;
		this.title = cate?.title;
	}

	private _formatResult(result: QueryResult): ICate[] {
		const list: ICate[] = [];
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
		const sql = 'select exists (select id from cates where id=$1) as existed';
		const result = await this.pool.query(sql, [this.id]);
		if (result.rows[0].existed) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async probeExistedByTitle(): Promise<boolean> {
		const sql = 'select exists (select id from cates where title=$1) as existed';
		const result = await this.pool.query(sql, [this.title]);
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

	async insert(): Promise<number> {
		const sql = 'insert into cates (title) values ($1) returning id';
		const result = await this.pool.query(sql, [this.title]);
		return Promise.resolve(result.rows[0].id);
	}

	async update() {
		const sql = 'update cates set title=$1 where id=$2';
		await this.pool.query(sql, [this.title, this.id]);
	}

	async remove() {
		const sql = 'delete from cates where id=$1';
		await this.pool.query(sql, [this.id]);
	}

}


export {
	ICate,
	Cate,
}