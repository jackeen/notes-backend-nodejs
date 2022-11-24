/**
 *
 */

import { Buffer } from "buffer";

import Jwt from 'jsonwebtoken';

import { Middleware } from '../router';
import { Roles } from "./roles";
import { Logger } from '../logger';

const secret = process.env.JWT_SECRET;

interface IPayLoad {
	roleId: number;
	userId: number;
	userName: string;
	nickName: string;
}

function generateToken(payLoad: IPayLoad): string {
	return Jwt.sign(payLoad, secret, {
		expiresIn: '24h',
	});
}

function validate(permission: string): Middleware {
	return async (ctx, next) => {
		const token = ctx.get('Authorization')?.replace('Bearer ', '');
		if (!token) {
			ctx.throw(401);
		}

		try {
			const payload = Jwt.verify(token, secret) as IPayLoad;
			const roleId = payload.roleId;
			if (roleId === Roles.ADMIN) {
				ctx.user = payload;
			} else {
				ctx.throw(403);
			}

		} catch(err) {
			ctx.throw(401);
		}

		await next();
	}
}


export {
	validate,
	IPayLoad,
	generateToken,
}