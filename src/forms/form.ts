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
	method: string;
	private _fields: Field[];

	private _existedProperties: Map<string, any>;
	private _available: boolean = true;
	private _unavailableField: string;

	constructor(name: string) {
		this.name = name;
	}

	loadBodyValues(ctx: ParameterizedContext, ...fields: Field[]) {
		this.method = ctx.request.method;

		const body = ctx.request.body;
		if (!body) {
			this._available = false;
			return;
		}

		const props = new Map<string, any>();
		for (const field of fields) {
			const fieldName = field.name;
			const userFieldValue = body[fieldName];
			if (userFieldValue !== undefined) {
				field.value = userFieldValue;
				props.set(fieldName, userFieldValue);
			}
		}
		this._existedProperties = props;
		this._fields = fields;
	}

	getExistedProperties(): Map<string, any> {
		return this._existedProperties;
	}

	validate(): boolean {
		if (!this._available) {
			return false;
		}

		const fields = this._fields;
		const method = this.method;
		for (const field of fields) {
			if (method.toLowerCase() === 'patch' &&
				this._existedProperties.get(field.name) === undefined) {
				continue;
			}
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