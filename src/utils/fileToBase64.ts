export function fileToBase64(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (reader.result) {
				if (typeof reader.result === 'string') {
					resolve(btoa(reader.result));
					return;
				} else {
					resolve(btoa(String.fromCharCode(...new Uint8Array(reader.result))));
					return;
				}
			}
			reject();
		};
		reader.onerror = (ev) => {
			reject();
		};

		reader.readAsBinaryString(file);
	});
}
