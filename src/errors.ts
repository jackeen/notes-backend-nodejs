import { Middleware, HttpError } from "koa";

import {Logger, TrafficSign} from "./logger";

const errorCatch: Middleware = async (ctx, next) => {
	// catching and standardizing the http errors
	try {
		await next();
	} catch (err) {
		if (err instanceof HttpError) {
			ctx.response.status = err.status;
			ctx.response.body = {
				error: err.status,
				message: err.message,
				success: false,
			}
		} else {
			ctx.response.status = 500;
			ctx.response.body = {
				error: 500,
				message: 'Internal running error',
				success: false,
			}
			Logger.error(`${err.message}`);
		}
	}

	// request and response log
	const req = ctx.request;
	const res = ctx.response;
	Logger.trafficLog(`${req.method} ${req.path}`, TrafficSign.IN);
	if (ctx.response.status >= 400) {
		Logger.trafficError(res.status, TrafficSign.OUT);
	} else {
		Logger.trafficInfo(res.status, TrafficSign.OUT);
	}
};

export default errorCatch;