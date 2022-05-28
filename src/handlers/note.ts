import { Middleware } from "koa";
import { pool } from "./db";
import { INote, Note } from "../models/note";
import { Logger } from "../logger";


const getAll: Middleware = async (ctx, next) => {
	const note = new Note(pool);
	let notes = await note.getAll();
	ctx.body = {
		success: true,
		count: notes.length,
		notes,
	}
}