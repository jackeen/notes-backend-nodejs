import { Middleware } from "koa";
import { PoolClient, Pool, Client } from "pg";

// import { Logger } from "../logger";
import Parser from "./parser";
import Handler from "./handler";
// import Form from "./form";


class Cates extends Handler {

	private db: Pool;

	constructor(db: Pool) {
		super();
		this.db = db;
	}


	public get: Middleware = async (ctx, next) => {
		const client = await this.db.connect();
		try {
			const result = await client.query('select * from cates');
			ctx.body = {
				success: true,
				count: result.rowCount,
				cates: Parser.cates(result),
			}
		} catch (err) {
			throw err;
		} finally {
			client.release();
			next();
		}
	}


	public post: Middleware = async (ctx, next) => {
		const title = ctx.request.body.title;
		if (!title) {
			ctx.throw(422);
		}

		const client = await this.db.connect();
		try {
			const result = await client.query('select 1 from cates where title=$1', [title]);
			if (result.rowCount === 0) {
				await client.query('insert into cates(title) values($1)', [title]);
			}
			ctx.body = {
				success: true,
			}
		} catch (err) {
			throw err;
		} finally {
			client.release();
		}
		next();
	}


	public patch: Middleware = async (ctx, next) => {
		const id = ctx.params.get('id');
		if (!id) {
			ctx.throw(404);
		}

		const title = ctx.request.body.title;
		if (!title) {
			ctx.throw(422);
		}

		const client = await this.db.connect();
		try {
			let result = await client.query('select 1 from cates where id=$1', [id]);
			if (result.rowCount === 0) {
				ctx.throw(404);
			}
			result = await client.query('select 1 from cates where title=$1', [title]);
			if (result.rowCount !== 0) {
				ctx.throw(409);
			}
			await client.query('update cates set title=$1 where id=$2', [title, id]);
			ctx.body = {
				success: true,
			}
		} catch (err) {
			throw err;
		} finally {
			client.release();
		}
		next();
	}


	public delete: Middleware = async (ctx, next) => {
		const id = ctx.params.get('id');
		if (!id) {
			ctx.throw(404);
		}

		const client = await this.db.connect();
		try {
			const result = await client.query('select 1 from cates where id=$1', [id]);
			if (result.rowCount === 0) {
				ctx.throw(404);
			}
			await client.query('delete from cates where id=$1', [id]);
			ctx.body = {
				success: true,
			}
		} catch (err) {
			throw err;
		} finally {
			client.release();
		}
		next();
	}

}


export default Cates;