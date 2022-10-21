class FormError implements Error {
	name: string;
	message: string;
	form: string;
	field: string;

	constructor(name: string, message: string, form: string, field: string) {
		this.name = name;
		this.message = message;
		this.form = form;
		this.field = field;
	}
}

export default FormError;