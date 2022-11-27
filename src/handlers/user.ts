/**
 *
 */

import { Middleware } from "koa";
import bcrypt from "bcrypt"

import { IUser, User } from "../models/user";
import { UserForm } from "../forms/user.form";
import { IAuthPayLoad, generateToken } from "../auth/validate";
import { Logger } from "../logger";

const login: Middleware = async (ctx, next) => {
	const form = new UserForm(ctx);
	if (!form.validate()) {
		ctx.throw(form.getFormError(), 422);
	}

	const user = new User(form.getExistedProperties());
	const plainPass = user.data.passWord;
	const existedUser = await user.fetchDetailByUserName();

	if (existedUser === null) {
		ctx.body = {
			success: false,
			message: 'user'
		}
		return;
	}

	const hashed = await bcrypt.hash(plainPass, existedUser.passSalt);
	if (hashed === existedUser.passWord) {
		await user.updateLatestLogin();
		ctx.body = {
			success: true,
			token: generateToken({
				roleId: existedUser.roleId,
				userId: existedUser.id,
				userName: existedUser.userName,
				nickName: existedUser.nickName,
			} as IAuthPayLoad),
		}
		return;
	}

	ctx.body = {
		success: false,
		message: 'password'
	}
}

const checkExisted: Middleware = async (ctx, next) => {
	const userName = ctx.params.get('user_name');
	const user = new User(new Map<string, any>([['user_name', userName]]));
	ctx.body = {
		success: true,
		existed: await user.probeExistedByUserName(),
	}
}

const createNew: Middleware = async (ctx, next) => {
	const form = new UserForm(ctx);
	if (!form.validate()) {
		ctx.throw(form.getFormError(), 422);
	}

	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(form.passWord.value, salt);
	form.updateFieldValue(form.passWord, hashedPassword);

	const user = new User(form.getExistedProperties());
	if (await user.probeExistedByUserName()) {
		ctx.throw(409);
	}

	user.data.passSalt = salt;
	const id = await user.insert();

	ctx.body = {
		success: true,
		user_id: id,
	}

}

export {
	login,
	createNew,
	checkExisted,
}