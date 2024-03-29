import { Middleware } from "koa";

import { Logger } from "../logger";
import { INote, Note } from "../models/note";
import { NoteForm } from "../forms/note.form";
import { isVisitor } from "../auth/validate";


const getAll: Middleware = async (ctx, next) => {
	const note = new Note();
	const notes = await note.getAll(false);
	ctx.body = {
		success: true,
		count: notes.length,
		notes,
	}
}

const fetchDetail: Middleware = async (ctx, next) => {
	const id = ctx.params.getNumber('id');
	if (id === undefined) {
		ctx.throw(422);
	}

	const note = new Note(new Map<string, any>([['id', id]]));

	if (!await note.probeExistedByID()) {
		ctx.throw(404);
	}

	const detail = await note.fetchDetail();

	if (isVisitor(ctx) && detail.isDraft) {
		ctx.throw(404);
	}

	ctx.body = {
		success: true,
		note: detail,
	}
}

const insert: Middleware = async (ctx, next) => {
	const form = new NoteForm(ctx);
	if (!form.validate()) {
		ctx.throw(form.getFormError(), 422);
	}

	const note = new Note(form.getExistedProperties());
	const noteExisted = await note.probeExistedByTitle();
	if (noteExisted) {
		ctx.throw(409);
	}

	const noteId = await note.insert();
	ctx.body = {
		success: true,
		id: noteId,
	}
}

const update: Middleware = async (ctx, next) => {
	const id = ctx.params.getNumber('id');
	if (id === undefined) {
		ctx.throw(422);
	}

	const form = new NoteForm(ctx);
	if (!form.validate()) {
		ctx.throw(form.getFormError(), 422);
	}

	const formData = form.getExistedProperties();
	formData.set('id', id);
	const note = new Note(formData);

	if (!await note.probeExistedByID()) {
		ctx.throw(404);
	}

	if (formData.get('title') && await note.probeExistedByTitle()) {
		ctx.throw(409);
	}

	await note.update();

	ctx.body = {
		success: true,
	}
}

const remove: Middleware = async (ctx, next) => {
	const id = ctx.params.getNumber('id');
	if (id === undefined) {
		ctx.throw(422);
	}

	const note = new Note(new Map<string, any>([['id', id]]));

	if (!await note.probeExistedByID()) {
		ctx.throw(404);
	}

	await note.remove();

	ctx.body = {
		success: true,
	}
}


export {
	getAll,
	fetchDetail,
	insert,
	update,
	remove,
}