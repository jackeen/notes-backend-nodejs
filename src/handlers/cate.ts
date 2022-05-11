import { Middleware } from "koa";
import { db } from "./db";
import { ICate, Cate } from "../models/cate";
import { Logger } from "../logger";


const getAll: Middleware = async (ctx, next) => {
	const cate = new Cate(db);
	const cates = await cate.getAll();
	ctx.body = {
		success: true,
		count: cates.length,
		cates,
	}
}


const insert: Middleware = async (ctx, next) => {
	const title = ctx.request.body.title;
	if (!title) {
		ctx.throw(422);
	}

	const cate = new Cate(db, {
		title,
		id: null,
	});

	if (await cate.probeExistedByTitle()) {
		ctx.throw(409);
	}

	const id = await cate.insert();
	ctx.body = {
		success: true,
		id,
	}
}


const update: Middleware = async (ctx, next) => {
	const id = ctx.params.get('id');
	if (id === undefined) {
		ctx.throw(422);
	}

	const title = ctx.request.body.title;
	if (!title) {
		ctx.throw(422);
	}

	const cate = new Cate(db, {
		id,
		title,
	});

	if (!await cate.probeExistedByID()) {
		ctx.throw(404);
	}

	if (await cate.probeExistedByTitle()) {
		ctx.throw(409);
	}

	await cate.update();

	ctx.body = {
		success: true,
	}

}


const remove: Middleware = async (ctx, next) => {
	const id = ctx.params.get('id');
	if (id === undefined) {
		ctx.throw(422);
	}

	const cate = new Cate(db, {
		id,
		title: null,
	});

	if (!await cate.probeExistedByID()) {
		ctx.throw(404);
	}

	await cate.remove();

	ctx.body = {
		success: true,
	}

}


export {
	getAll,
	insert,
	update,
	remove,
}
