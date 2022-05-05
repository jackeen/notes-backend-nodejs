import Koa, {Middleware, Context, Next} from "koa";
import { Pool, PoolConfig, PoolClient, QueryResultBase} from "pg";

// for router using it to collect restful params during request
declare module "koa" {
	interface DefaultContext {
		params: Map<string, any>;
	}
}

export {
	Koa,
	Pool,
	PoolClient,
};

export type { Middleware, Context, Next, PoolConfig};