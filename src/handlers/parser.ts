import { QueryResult, QueryResultRow } from "pg";
import { Tag } from "./db";


class Parser {

	static tag(o: any): Tag {
		return {
			id: o.id,
			title: o.title,
		}
	}
	static tags(res: QueryResult): Tag[] {
		const data: Tag[] = [];
		res.rows.forEach((v: any) => {
			data.push(this.tag(v));
		});
		return data;
	}


}

export default Parser;