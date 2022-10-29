import { Middleware } from "koa";
import { pool } from "./db";
import { ICate, Cate } from "../models/cate";
import { Logger } from "../logger";


const getAll: Middleware = async (ctx, next) => {
	const withNotesCount = ctx.request.query.c;
	const cate = new Cate(pool);

	let cates: ICate[];
	if (withNotesCount === '1') {
		cates = await cate.getAllWithNotesCount();
	} else {
		cates = await cate.getAll();
	}

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

	const cate = new Cate(pool, {
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
	const id = ctx.params.getNumber('id');
	if (id === undefined) {
		ctx.throw(422);
	}

	const title = ctx.request.body.title;
	if (!title) {
		ctx.throw(422);
	}

	const cate = new Cate(pool, {
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
	const id = ctx.params.getNumber('id');
	if (id === undefined) {
		ctx.throw(422);
	}

	const cate = new Cate(pool, {
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
