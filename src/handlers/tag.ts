import { Middleware } from "koa";
import { pool } from "./db";
import { ITag, Tag } from "../models/tag";
import { Logger } from "../logger";


const getAll: Middleware = async (ctx, next) => {
	const tag = new Tag(pool);
	const tags = await tag.getAll();
	ctx.body = {
		success: true,
		count: tags.length,
		tags,
	}
}


const insert: Middleware = async (ctx, next) => {
	const title = ctx.request.body.title;
	if (!title) {
		ctx.throw(422);
	}

	const tag = new Tag(pool, {
		title,
		id: null,
	});

	if (await tag.probeExistedByTitle()) {
		ctx.throw(409);
	}

	const id = await tag.insert();
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

	const tag = new Tag(pool, {
		id,
		title,
	});

	if (!await tag.probeExistedByID()) {
		ctx.throw(404);
	}

	if (await tag.probeExistedByTitle()) {
		ctx.throw(409);
	}

	await tag.update();

	ctx.body = {
		success: true,
	}

}


const remove: Middleware = async (ctx, next) => {
	const id = ctx.params.get('id');
	if (id === undefined) {
		ctx.throw(422);
	}

	const tag = new Tag(pool, {
		id,
		title: null,
	});

	if (!await tag.probeExistedByID()) {
		ctx.throw(404);
	}

	await tag.remove();

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
