import { ParameterizedContext } from "koa";

import { Form, Field } from "./form";
import { limitedString, rangeInteger } from "./validators";


class UserForm extends Form {

	userName = new Field('user_name', limitedString(8, 16));
	passWord = new Field('pass_word', limitedString(8, 16));

	constructor(ctx: ParameterizedContext) {
		super('user');
		this.loadBodyValues(ctx,
							this.userName,
							this.passWord);
	}
}

export {
	UserForm,
}