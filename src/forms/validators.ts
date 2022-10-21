type Validator = (v: any) => boolean;

function stringLength(min: number, max: number): Validator {
	return (v: any) => {
		const n = String(v).length;
		if (n <= max && n >= min) {
			return true;
		}
		return false;
	}
}

function isBoolean(): Validator {
	return (v: any) => {
		if (typeof v === 'boolean') {
			return true;
		}
		return false;
	}
}

function rangeInteger(min?: number, max?: number): Validator {
	return (v: any) => {
		if (!Number.isInteger(v)) {
			return false;
		}
		if (min && v < min ) {
			return false;
		}
		if (max && v > max) {
			return false;
		}
		return true;
	}
}

export {
	Validator,
	stringLength,
	rangeInteger,
	isBoolean,
}