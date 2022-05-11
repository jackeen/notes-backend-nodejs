// import { Request } from "koa";
// // import { Tag, Cate, Note } from "./db";
// // import Notes from "./notes";


// type Validator = (v: any) => boolean;
// // type enum = {
// // 	string,
// // 	string,
// // }

// function requiredString(v: any): boolean {
// 	if (typeof(v) === 'string' && v.length) {
// 		return true;
// 	}
// 	return false;
// }


// interface Field {
// 	name: string;
// 	message?: string;
// 	validator?: Validator;
// }

// interface StringField extends Field {

// }

// interface DateField {

// }

// interface SelectField {
// 	choices: []
// }

// interface MultiSelectField {

// }

// interface BooleanField {

// }


// class Form {

// 	body: any;

// 	constructor(req: Request) {
// 		this.body = req.body;
// 	}

// 	validate(): Error {



// 		return null;
// 	}
// }

// export {
// 	Form,
// 	Field
// };