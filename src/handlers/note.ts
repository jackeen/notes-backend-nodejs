import { Middleware } from "koa";

import { pool } from "./db";
import { Logger } from "../logger";

import { INote, Note } from "../models/note";
import { NoteForm } from "../forms/note.form";



const getAll: Middleware = async (ctx, next) => {
	const note = new Note(pool);
	const notes = await note.getAll();
	ctx.body = {
		success: true,
		count: notes.length,
		notes,
	}
}


const insert: Middleware = async (ctx, next) => {

	// Logger.debug(ctx.request.body);

	const form = new NoteForm(ctx);
	form.validate();

	const note = new Note(pool, form.formatData());
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


export {
	getAll,
	insert,
}