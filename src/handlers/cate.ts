/**
 * Category handler, which provides the organized way to hold notes.
 *
 */

import { Middleware } from "koa";

import { ICate, Cate } from "../models/cate";
import { CateForm } from "../forms/cate.form";


const getAll: Middleware = async (ctx, next) => {
	const withNotesCount = ctx.request.query.c;
	const cate = new Cate();

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
	const form = new CateForm(ctx);
	if (!form.validate()) {
		ctx.throw(form.getFormError(), 422);
	}

	const cate = new Cate(form.getExistedProperties());

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
	if (isNaN(id)) {
		ctx.throw(422);
	}

	const form = new CateForm(ctx);
	if (!form.validate()) {
		ctx.throw(form.getFormError(), 422);
	}

	const formData = form.getExistedProperties();
	formData.set('id', id);
	const cate = new Cate(formData);

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

	const cate = new Cate(new Map<string, any>([['id', id]]));

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
