/**
 *
 */

import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

import { Logger } from "../logger";
import { Model } from "./model";

interface INote {
	id?: number;
	title: string;
	content?: string;
	poster?: string;
	createDate?: string;
	editDate?: string;
	cateId: number;
	isDraft: boolean;
	tags?: string[];
}

class Note extends Model {

	data: INote;

	constructor(prop?: Map<string, any>) {
		super();
		if (prop) {
			this.data = {
				id: prop.get('id'),
				title: prop.get('title'),
				content: prop.get('content'),
				poster: prop.get('poster'),
				isDraft: prop.get('is_draft'),
				cateId: prop.get('cate_id'),
				createDate: '',
				editDate: '',
			};
			this.properties = prop;
		}
	}

	// getDataMap(): Map<string, any> {
	// 	return new Map<string, any>([
	// 		['id', this.data.id],
	// 	]);
	// }

	// static date2string(d: Date): string {
	// 	const year = d.getFullYear();
	// 	const month = d.getMonth() + 1;
	// 	const day = d.getDate();
	// 	return `${year}-${month}-${day}`;
	// }

	// static string2date(s: string): Date {
	// 	return new Date(s);
	// }

	private _formatResult(result: QueryResult): INote[] {
		const list: INote[] = [];
		if (result.rowCount !== 0) {
			result.rows.forEach((row: QueryResultRow) => {
				list.push({
					id: row.id,
					title: row.title,
					content: row.content,
					poster: row.poster,
					createDate: this.date2string(row.create_date),
					editDate: this.date2string(row.edit_date),
					cateId: row.cate_id,
					isDraft: row.is_draft,
					tags: (row.tags === null) ? [] : row.tags,
				} as  INote);
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

	async count(): Promise<number> {
		const sql = 'select count(id) from notes';
		const result = await this.pool.query(sql);
		return Promise.resolve(result.rows[0].count);
	}

	private _getSQLForNotes(condition: string, includeTags: boolean): string {

		if (!includeTags) {
			return `select * from notes where ${condition} order by id`;
		}

		return `
			select notes.*, array_agg(tags.title order by tags.id)
			filter (where tags.title is not null) as tags
			from notes
			left join tags_notes
			on notes.id = tags_notes.note_id
			left join tags
			on tags_notes.tag_id = tags.id
			where ${condition}
			group by notes.id
			order by notes.id;
		`;
	}

	async getAll(includeDraft: boolean): Promise<INote[]> {
		const condition = (includeDraft) ? 'notes.is_draft = true' : 'true';
		const sql = this._getSQLForNotes(condition, true);
		const result = await this.pool.query(sql);
		return Promise.resolve(this._formatResult(result));
	}

	async fetchDetail(): Promise<INote> {
		const sql = this._getSQLForNotes('notes.id=$1', true);
		const result = await this.pool.query(sql, [this.data.id]);
		this.data = this._formatResult(result)[0];
		return Promise.resolve(this.data);
	}

	async insert(): Promise<number> {
		const data = this.data;
		const createDate = this.date2string(new Date());
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

		const editDate = this.date2string(new Date());
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