import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { Logger } from "../logger";


interface INote {
	id?: number;
	title: string;
	content?: string;
	poster?: string;
	createDate?: string;
	editDate?: string;
	cateId: number;
	isDraft: boolean;
}

class Note {

	pool: Pool;
	data: INote;
	properties: Map<string, any>;

	constructor(pool: Pool, prop?: Map<string, any>) {
		this.pool = pool;
		this.data = {
			id: prop.get('id'),
			title: prop.get('title'),
			content: prop.get('content'),
			poster: prop.get('poster'),
			isDraft: prop.get('isDraft'),
			cateId: prop.get('cateId'),
			// createDate: null,
			// editDate: null,
		};
		this.properties = prop;
	}

	// getDataMap(): Map<string, any> {
	// 	return new Map<string, any>([
	// 		['id', this.data.id],
	// 	]);
	// }

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
					content: row.content,
					poster: row.poster,
					createDate: Note.date2string(row.create_date),
					editDate: Note.date2string(row.edit_date),
					cateId: row.cate_id,
					isDraft: row.is_draft,
				});
			});
		}
		return list;
	}

	async probeExistedByID(): Promise<boolean> {
		const sql = 'select exists (select id from notes where id=$1) as existed';
		const id = this.data.id;
		const result = await this.pool.query(sql, [id]);
		if (result.rows[0].existed) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async probeExistedByTitle(): Promise<boolean> {
		const sql = 'select exists (select id from notes where title=$1) as existed';
		const title = this.data.title;
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
		const data = this.data;
		const createDate = Note.date2string(new Date());
		const keys: string[] = ['title', 'content', 'poster', 'cate_id', 'is_draft', 'create_date', 'edit_date'];
		const $s: string[] = ['$1', '$2', '$3', '$4', '$5', '$6', '$7'];
		const values: any[] = [data.title, data.content, data.poster, data.cateId, data.isDraft, createDate, createDate];

		const sql = `insert into notes (${keys.join(',')}) values (${$s.join(',')}) returning id`;
		const result = await this.pool.query(sql, values);
		return Promise.resolve(result.rows[0].id);
	}

	async update() {
		const keys: string[] = [];
		const values: any[] = [];

		for (const [k, v] of this.properties) {
			keys.push(k);
			values.push(v);
		}

		const editDate = Note.date2string(new Date());
		keys.push('edit_date')
		values.push(editDate)

		let valueIndex = 1;
		const keyValuePair: string[] = [];
		for (const key of keys) {
			keyValuePair.push(`${key}=$${valueIndex}`);
			valueIndex++;
		}

		const sql = `update notes set ${keyValuePair.join(',')} where id=$${valueIndex}`;
		await this.pool.query(sql, [...values, this.data.id]);
	}

	async remove() {
		const sql = 'delete from notes where id=$1';
		await this.pool.query(sql, [this.data.id]);
	}

}


export {
	INote,
	Note,
}