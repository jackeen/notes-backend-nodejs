
import {Middleware, PoolClient, Pool} from "../types";
import { Logger } from "../logger";

class Tags {

	private db: Pool;

	constructor(db: Pool) {
		this.db = db;
	}

	public getList: Middleware = async (ctx, next) => {
		const client = await this.db.connect();
		try {
			const result = await client.query('select * from tags');
			ctx.body = {
				n: result.rows.length,
			}
			Logger.trace(ctx.path, result.rows.length, ctx.body);
		} catch (err) {
			throw err;
		} finally {
			client.release();
			next();
		}
	}

}

export default Tags;


