
class CustomParam {

	values: Map<string, any>;

	constructor() {
		this.values = new Map<string, any>();
	}

	get(key: string): string {
		return String(this.values.get(key));
	}

	getNumber(key: string): number {
		return Number(this.values.get(key));
	}

	set(key: string, value: any) {
		this.values.set(key, value);
	}
}

export {
	CustomParam,
};