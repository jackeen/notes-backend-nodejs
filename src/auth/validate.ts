import {Middleware} from '../router';
import { Logger } from '../logger';

function validate(permission: string): Middleware {
	return async (ctx, next) => {
		const token = ctx.cookies.get('Authorization');
		Logger.info(`${ctx.path} auth pass`);
		await next();
	}
}

export default {
	validate,
}