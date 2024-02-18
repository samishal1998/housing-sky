import React, { useCallback, useRef, useState } from 'react';

export const useFileInput = ({
	single,
	mimeType,
	onFileChangeCallback,
}: {
	single: boolean;
	mimeType: string;
	onFileChangeCallback?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const fileInput = useRef<HTMLInputElement>(null);

	const openInput = useCallback(() => {
		fileInput.current?.click();
	}, []);

	const clear = useCallback(() => {
		setSelectedFiles([]);
		if (fileInput.current) fileInput.current.value = '';
	}, []);

	const onFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files ? Array.from(e.target.files) : [];
			if (single) {
				setSelectedFiles(files);
			} else {
				setSelectedFiles((selectedFiles) => [...selectedFiles, ...files]);
			}
			onFileChangeCallback?.(e);
			if (fileInput.current) fileInput.current.value = '';
		},
		[single, onFileChangeCallback],
	);

	return {
		onFileChange,
		multiple: !single,
		mimeType,
		fileInput,
		openInput,
		clear,
		selectedFiles,
		setSelectedFiles,
	};
};
export const bindFileInputElement = (fileInputData: ReturnType<typeof useFileInput>) => {
	return {
		ref: fileInputData.fileInput,
		type: 'file',
		style: { display: 'none' },
		onChangeCapture: fileInputData.onFileChange,
		multiple: fileInputData.multiple,
		accept: fileInputData.mimeType,
	};
};
