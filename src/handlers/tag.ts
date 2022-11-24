/**
 *
 */

import { Middleware } from "koa";

import { TagForm } from "../forms/tag.form";
import { ITag, Tag } from "../models/tag";
import { Logger } from "../logger";


const getAll: Middleware = async (ctx, next) => {
	const tag = new Tag();
	const tags = await tag.getAll();
	ctx.body = {
		success: true,
		count: tags.length,
		tags,
	}
}


const insert: Middleware = async (ctx, next) => {
	const form = new TagForm(ctx);
	if (!form.validate()) {
		ctx.throw(form.getFormError(), 422);
	}

	const tag = new Tag(form.getExistedProperties());

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
	const id = ctx.params.getNumber('id');
	if (isNaN(id)) {
		ctx.throw(422);
	}

	const form = new TagForm(ctx);
	if (!form.validate()) {
		ctx.throw(form.getFormError(), 422);
	}

	const formData = form.getExistedProperties();
	formData.set('id', id);
	const tag = new Tag(formData);

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
	const id = ctx.params.getNumber('id');
	if (isNaN(id)) {
		ctx.throw(422);
	}

	const tag = new Tag(new Map<string, any>([['id', id]]));

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
