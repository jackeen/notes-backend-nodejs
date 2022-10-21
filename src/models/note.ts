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

	constructor(pool: Pool, data?: INote) {
		this.pool = pool;
		this.data = data;
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

	async update(
				title?: string,
				content?: string,
				poster?: string,
				cateId?: number,
				isDraft?: boolean
			) {

		const data = this.data;
		const keys: string[] = [];
		const values: any[] = [];

		if (title) {
			keys.push('title')
			values.push(title)
		}

		if (content) {
			keys.push('content')
			values.push(content)
		}

		if (poster) {
			keys.push('poster')
			values.push(poster)
		}

		if (cateId) {
			keys.push('cate_id')
			values.push(cateId)
		}

		if (isDraft) {
			keys.push('isDraft')
			values.push(isDraft)
		}

		const editDate = Note.date2string(new Date());
		keys.push('edit_date')
		values.push(editDate)

		let valueIndex = 0;
		const keyValuePair: string[] = [];
		for (const key of keys) {
			keyValuePair.push(`${key}=${values[valueIndex]}`);
			valueIndex++;
		}

		const sql = `update notes set ${keys.join(',')} where id=$${valueIndex}`;
		await this.pool.query(sql, [...values, data.id]);
	}

	async remove() {
		const sql = 'delete from notes where id=$1';
		const id = this.data.id;
		await this.pool.query(sql, [id]);
	}

}


export {
	INote,
	Note,
}