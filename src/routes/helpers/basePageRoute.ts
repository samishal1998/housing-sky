export class BasePageRoute<RouteParams extends Record<string, any>> {
	constructor(public route: string) {}

	generatePath(params?: Partial<RouteParams>) {
		let output = this.route;
		Object.entries(params ?? {}).forEach(([k, v]) => {
			output = output.replace(new RegExp(`:${k}[\?]*`), v?.toString() as string);
		});
		return output;
	}
}
