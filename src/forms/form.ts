import { ParameterizedContext } from "koa";

import { IField, Field } from "./field";
import SelectField from "./select.field";
import { Validator,
		 isBoolean,
		 rangeInteger,
		 stringLength,
		} from "./validators";


class Form {

	name: string;
	private _fields: Field[];

	private _available: boolean = true;
	private _unavailableField: string;

	constructor(name: string) {
		this.name = name;
	}

	loadBodyValues(ctx: ParameterizedContext, ...fields: Field[]) {
		const body = ctx.request.body;

		if (!body) {
			this._available = false;
			return;
		}

		for (const field of fields) {
			field.value = body[field.name];
		}
		this._fields = fields;
	}

	validate(): boolean{

		if (!this._available) {
			return false;
		}

		const fields = this._fields;
		for (const field of fields) {
			const validators = field.validators;
			for (const validator of validators) {
				if (!validator(field.value)) {
					this._available = false;
					this._unavailableField = field.name;
					return false;
				}
			}
		}

		return true;
	}

	getFormError(): string {
		let error: string = 'form';
		if (!this._available) {
			error += `-${this.name}`;
			if (this._unavailableField) {
				error += `-${this._unavailableField}`;
			}
			return error;
		}
		return null;
	}
}

export {
	Form,
	Field,
	SelectField,
	rangeInteger,
	stringLength,
	isBoolean,
};