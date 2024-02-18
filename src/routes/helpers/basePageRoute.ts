export class BasePageRoute<RouteParams> {
	constructor(public route: string) {}

	generatePath(params?: Partial<RouteParams>) {
		let output = this.route;
		Object.entries(params ?? {}).forEach(([k, v]) => {
			output = output.replace(new RegExp(`:${k}[\?]*`), v as any);
		});
		return output;
	}
}
