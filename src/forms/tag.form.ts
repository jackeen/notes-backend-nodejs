/**
 * TagForm.
 *
 */

import { ParameterizedContext } from "koa";

import { Form, Field } from "./form";
import { limitedString } from "./validators";


class TagForm extends Form {

	title = new Field('title', limitedString(2, 16));

	constructor(ctx: ParameterizedContext) {
		super('tag');
		this.loadBodyValues(ctx,
							this.title,
							);
	}
}

export {
	TagForm,
}