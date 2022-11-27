/**
 *
 */

import Jwt from 'jsonwebtoken';
import { Middleware, ParameterizedContext } from "koa";

import { Roles } from "./roles";
import { Methods } from './methods';
import { Assets } from './assets';
import { verifyPermission } from './permissions';
import { Logger } from '../logger';


const secret = process.env.JWT_SECRET;

interface IAuthPayLoad {
	roleId: number;
	userId: number;
	userName: string;
	nickName: string;
}

interface IToken {
	tokenMissing: boolean;
	verifyFailed: boolean;
}

declare module "koa" {
	interface DefaultContext {
		authPayload: IAuthPayLoad;
		token: IToken;
	}
}


function generateToken(payLoad: IAuthPayLoad): string {
	return Jwt.sign(payLoad, secret, {
		expiresIn: '24h',
	});
}


const extractToken: Middleware =  async (ctx, next) => {
	const token = ctx.get('Authorization')?.replace('Bearer ', '');

	ctx.token = {
		tokenMissing: false,
		verifyFailed: false,
	} as IToken;

	ctx.authPayload = {
		roleId: Roles.VISITOR,
		userId: null,
		userName: null,
		nickName: null,
	} as IAuthPayLoad;

	if (token) {
		try {
			const payload = Jwt.verify(token, secret) as IAuthPayLoad;
			ctx.authPayload.roleId = payload.roleId || null;
			ctx.authPayload.userId = payload.roleId || null;
			ctx.authPayload.userName = payload.userName || null;
			ctx.authPayload.nickName = payload.nickName || null;
		} catch(err) {
			ctx.token.verifyFailed = true;
		}
	} else {
		ctx.token.tokenMissing = true;
	}
	await next();
}


function isAdmin(ctx: ParameterizedContext): boolean {
	return ctx.authPayload.roleId === Roles.ADMIN;
}


function isVisitor(ctx: ParameterizedContext): boolean {
	return ctx.authPayload.roleId === Roles.VISITOR;
}


/**
 * Validating permissions set in http header named as 'Authorization'.
 * @param method, http method
 * @param asset,
 * @returns void
 */
function validate(method: Methods, asset: Assets): Middleware {
	return async (ctx, next) => {
		if (ctx.token.tokenMissing || ctx.token.verifyFailed) {
			ctx.throw(401);
		}

		if (!verifyPermission(ctx.authPayload.roleId, method, asset)) {
			ctx.throw(403);
		}

		await next();
	}
}


export {
	extractToken,
	validate,
	IAuthPayLoad,
	generateToken,
	isAdmin,
	isVisitor,
}