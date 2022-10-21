import { Validator } from "./validators";

interface IField {
	name: string;
	value?: any;
	validators?: Validator[];
}

class Field implements IField {
	name: string;
	value?: any;
	validators?: Validator[] = [];

	constructor(name: string, ...customValidators: Validator[]) {
		this.name = name;
		for (const validator of customValidators) {
			this.validators.push(validator);
		}
	}
}

export {
	IField,
	Field,
}