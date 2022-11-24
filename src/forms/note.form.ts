import { ParameterizedContext } from "koa";

import { Form, Field } from "./form";
import { isBoolean, rangeInteger, limitedString } from "./validators";


class NoteForm extends Form {

	title = new Field('title', limitedString(1, 300));
	content = new Field('content', limitedString(0, 50000));
	poster = new Field('poster', limitedString(0, 500));
	isDraft = new Field('is_draft', isBoolean());
	cateId = new Field('cate_id', rangeInteger());

	constructor(ctx: ParameterizedContext) {
		super('note');
		this.loadBodyValues(ctx,
							this.title,
							this.content,
							this.poster,
							this.isDraft,
							this.cateId);
	}
}

export {
	NoteForm,
}