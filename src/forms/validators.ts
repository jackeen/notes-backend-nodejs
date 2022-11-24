/**
 * Validators for forms in several assets.
 */

type Validator = (v: any) => boolean;

/**
 * Validating the given string matching the restriction.
 * @param min, optional integer for minimal length of the string, default 0.
 * @param max, optional integer for maximal length of the string, default 1024.
 * @returns boolean
 */
function limitedString(min?: number, max?: number): Validator {
	return (v: any) => {
		if (typeof v !== 'string') {
			return false;
		}
		if (!min) {
			min = 0;
		}
		if (!max) {
			max = 1024;
		}
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

function isEmail(): Validator {
	return (v: any) => {
		const r = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
		return r.test(v);
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
	limitedString,
	rangeInteger,
	isBoolean,
	isEmail,
}