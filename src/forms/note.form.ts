import { ParameterizedContext } from "koa";
import { INote } from "../models/note";
import { Form,
		 Field,
		 isBoolean,
		 rangeInteger,
		 stringLength,
 		} from "./form";


class NoteForm extends Form {

	title = new Field('title', stringLength(1, 300));
	content = new Field('content', stringLength(0, 50000));
	poster = new Field('poster', stringLength(0, 500));
	isDraft = new Field('is_draft', isBoolean());
	cateId = new Field('cate_id', rangeInteger());

	constructor(ctx: ParameterizedContext) {
		super('note');
		this.loadBodyValues(ctx,
							this.title,
							this.content,
							this.poster,
							this.isDraft,
							this.cateId);
	}

	formatData(): INote {
		return {
			title: this.title.value,
			content: this.content.value,
			poster: this.poster.value,
			isDraft: this.isDraft.value,
			cateId: this.cateId.value,
		}
	}
}

export {
	NoteForm,
}