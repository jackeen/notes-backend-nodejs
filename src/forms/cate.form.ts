/**
 * CateForm, which defines the limitation and type for the fields of the category.
 *
 */

import { ParameterizedContext } from "koa";

import { Form, Field } from "./form";
import { limitedString } from "./validators";


class CateForm extends Form {

	title = new Field('title', limitedString(2, 16));

	constructor(ctx: ParameterizedContext) {
		super('cate');
		this.loadBodyValues(ctx,
							this.title,
							);
	}
}

export {
	CateForm,
}