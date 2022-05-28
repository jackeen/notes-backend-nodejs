import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { Logger } from "../logger";


interface INote {
	id: number;
	title: string;
	contents?: string;
	poster?: string;
	createDate: Date;
	editDate: Date;
	cateId: number;
	isDraft: boolean;
}

class Note {

	pool: Pool;
	fields: Map<string, any>;

	constructor(pool: Pool, data?: Map<string, any>) {
		this.pool = pool;
		this.fields = data;
	}

	static date2string(d: Date): string {
		const year = d.getFullYear();
		const month = d.getMonth() + 1;
		const day = d.getDate();
		return `${year}-${month}-${day}`;
	}

	static string2date(s: string): Date {
		return new Date(s);
	}

	private _formatResult(result: QueryResult): INote[] {
		const list: INote[] = [];
		if (result.rowCount !== 0) {
			result.rows.forEach((row: QueryResultRow) => {
				list.push({
					id: row.id,
					title: row.title,
					contents: row.contents,
					poster: row.poster,
					createDate: row.create_date,
					editDate: row.edit_date,
					cateId: row.cate_id,
					isDraft: row.is_draft,
				});
			});
		}
		return list;
	}

	async probeExistedByID(): Promise<boolean> {
		const sql = 'select exists (select id from notes where id=$1) as existed';
		const id = this.fields.get('id');
		const result = await this.pool.query(sql, [id]);
		if (result.rows[0].existed) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async probeExistedByTitle(): Promise<boolean> {
		const sql = 'select exists (select id from notes where title=$1) as existed';
		const title = this.fields.get('title');
		const result = await this.pool.query(sql, [title]);
		if (result.rows[0].existed) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async getAll(): Promise<INote[]> {
		const sql = 'select * from notes order by id';
		const result = await this.pool.query(sql);
		return Promise.resolve(this._formatResult(result));
	}

	async insert(): Promise<number> {
		const fields = this.fields;
		const $s: string[] = [];
		const keys: string[] = [];
		const values: any[] = [];

		let i = 0;
		for (const item of fields) {
			$s.push(`$${i+1}`);
			i++;
			keys.push(item[0]);
			values.push(item[1]);
		}

		const sql = `insert into notes (${values.join(',')}) values (${$s.join(',')}) returning id`;
		const result = await this.pool.query(sql, values);
		return Promise.resolve(result.rows[0].id);
	}

	async update() {
		const fields = this.fields;
		const keyValues: string[] = [];
		const values: string[] = [];

		let i = 0;
		for (const item of fields) {
			keyValues.push(`${item[0]}=$${i+1}`);
			values.push(`$${i+1}`);
			i++;
		}

		const sql = `update notes set ${keyValues.join(',')} where id=$${i}`;
		await this.pool.query(sql, [...values, fields.get('id')]);
	}

	async remove() {
		const sql = 'delete from notes where id=$1';
		const id = this.fields.get('id');
		await this.pool.query(sql, [id]);
	}

}


export {
	INote,
	Note,
}