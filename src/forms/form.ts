import { ParameterizedContext } from "koa";

import { IField, Field } from "./field";
import SelectField from "./select.field";
import FormError from "./form.error";
import { Validator,
		 isBoolean,
		 rangeInteger,
		 stringLength,
		} from "./validators";


class Form {

	name: string;
	fields: Field[];

	constructor(name: string) {
		this.name = name;
	}

	loadBodyValues(ctx: ParameterizedContext, ...fields: Field[]) {
		const body = ctx.request.body;
		const bodyMap = new Map();

		if (!body) {
			throw new FormError('', '', this.name, '');
		}

		Object.entries(body).forEach(([k, v], i) => {
			bodyMap.set(k, v);
		});

		for (const field of fields) {
			field.value = bodyMap.get(field.name);
		}
		this.fields = fields;
	}

	validate() {
		const fields = this.fields;
		for (const field of fields) {
			const validators = field.validators;
			for (const validator of validators) {
				if (!validator(field.value)) {
					throw new FormError('', '', this.name, field.name);
				}
			}
		}
	}
}

export {
	Form,
	FormError,
	Field,
	SelectField,
	rangeInteger,
	stringLength,
	isBoolean,
};