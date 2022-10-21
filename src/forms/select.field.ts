import { IField } from "./field";
import { Validator } from "./validators";

class SelectField implements IField {
	name: string;
	value?: any;
	validators?: Validator[];

	choices: string[];
	selected: string[];
}

export default SelectField;