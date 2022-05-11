

interface INote {
	id: number;
	title: string;
	contents?: string;
	poster?: string;
	createDate: Date;
	editDate: Date;
	cateId: number;
	isDraft: boolean;
}