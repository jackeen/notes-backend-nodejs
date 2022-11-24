/**
 *
 */

import { QueryResult, QueryResultRow } from "pg";

import { Model } from "./model";
import { Roles } from "../auth/roles";
import { Logger } from "../logger";

interface IUser {
	id?: number;
	userName: string;
	passWord: string;
	passSalt: string;
	latestLogin: string;
	createDate: string;
	roleId: number;
	nickName?: string;
	email?: string;
}

class User extends Model {

	data: IUser;

	constructor(prop?: Map<string, any>) {
		super();
		if (prop) {
			this.data = {
				id: prop.get('id'),
				userName: prop.get('user_name'),
				passWord: prop.get('pass_word'),
				passSalt: prop.get('pass_salt'),
				latestLogin: prop.get('latest_login'),
				createDate: null,
				roleId: prop.get('role_id'),
				nickName: prop.get('nick_name'),
				email: prop.get('email'),
			};
		}
		this.properties = prop;
	}

	private _formatResult(result: QueryResult):IUser[] {
		const list: IUser[] = [];
		if (result.rowCount !== 0) {
			result.rows.forEach((row: QueryResultRow) => {
				list.push({
					id: row.id,
					roleId: row.role_id,
					userName: row.user_name,
					passWord: row.pass_word,
					passSalt: row.pass_salt,
					nickName: row.nick_name,
					latestLogin: row.latest_login,
					createDate: row.create_date,
					email: row.email,
				} as IUser);
			});
		}
		return list;
	}

	// async getAll(): Promise<IUser[]> {

	// }

	async fetchDetailByUserName(): Promise<IUser> {
		const userName = this.data.userName;
		const sql = `select * from users where user_name=$1 limit 1`;
		const result = await this.pool.query(sql, [userName]);
		const resultUsers = this._formatResult(result);
		if (resultUsers.length === 0) {
			this.data = null;
		} else {
			this.data = resultUsers[0];
		}
		return Promise.resolve(this.data);
	}

	async updateLatestLogin() {
		const sql = `update users set latest_login=$1 where id=$2`;
		await this.pool.query(sql, [this.date2string(new Date()), this.data.id]);
	}

	// async updateNickName() {

	// }

	// async updateEmail() {

	// }

	async probeExistedByUserName(): Promise<boolean> {
		const sql = 'select exists (select id from users where user_name=$1) as existed';
		const result = await this.pool.query(sql, [this.data.userName]);
		if (result.rows[0].existed) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	/**
	 * Inserting a new user, the role of it is READER by default.
	 * @returns The ID of the user inserted.
	 */
	async insert(): Promise<number> {
		const sql = `
			insert into users
			(role_id, user_name, pass_word, pass_salt, create_date)
			values ($1, $2, $3, $4, $5)
			returning id
		`;

		const values = [
			Roles.READER,
			this.data.userName,
			this.data.passWord,
			this.data.passSalt,
			this.date2string(new Date()),
		];
		const result = await this.pool.query(sql, values);
		return Promise.resolve(result.rows[0].id);
	}

	// async elevate(newRole: number) {

	// }

}

export {
	Roles,
	IUser,
	User,
}