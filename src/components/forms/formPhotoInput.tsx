import { useEffect, useRef, useState } from 'react';
import {XCircle} from "lucide-react";
import {FileImage, fileImageKey} from "~/components/forms/file-image";

export type BasicChangeEvent = { target: { value:any } };
export type BasicChangeEventHandler = (event: BasicChangeEvent) => void;

export function FormPhotoField({
	error,
	onChange,
	label = 'Images',
	value,
	disabled,
	className,
								   sourceGetter,
}: {
	onChange?: BasicChangeEventHandler;
	label?: string;
	error?: string;
	className?: string;
	value?: (File|string)[];
	disabled?: boolean;
	preventDownloading?: boolean;sourceGetter?:(source:any)=>any,
}) {
	const fileInput = useRef<HTMLInputElement>(null);



	const imagesChanged = (newArray:any[]) => {
			const event = { target: { value: newArray } };
			(onChange as BasicChangeEventHandler | null)?.(event);
	};
	const removeImage = (index:number) => {
		value?.splice(index, 1);
		imagesChanged([...(value ?? [])]);
	};
	const openInput = () => {
		fileInput.current?.click();
	};
	const onFileChange = (e:any) => {
		imagesChanged([...(value ?? []), ...e.target.files]);
		if (fileInput.current) fileInput.current.value = '';
	};

	return (
		<div
			className={
				'm-w-full relative overflow-hidden rounded-xl bg-primary/5  py-5  px-3 md:py-10' +
				className
			}>
			{disabled && (
				<div
					className={'z-19 absolute left-0 top-0 h-full w-full bg-gray-500 opacity-50'}
				/>
			)}
			<h5 style={{ fontSize: '1.5rem', fontWeight: 500 }}>{label}</h5>
			{error ? <div className={'text-lg font-bold text-red-500'}>{error}</div> : <></>}
			<div className={'flex flex-row px-2 py-5 md:px-5'} style={{ overflow: 'auto' }}>
				<div
					className={
						'align-center bg-white-grey-hover square relative mx-3 flex h-[clamp(120px,20vw,180px)] min-h-[120px] w-[clamp(120px,20vw,180px)] min-w-[120px] cursor-pointer flex-row justify-center rounded-2xl text-center text-[4rem] text-primary ring-1 ring-primary '
					}
					style={{
						flex: '0 0 auto',
					}}
					onClickCapture={openInput}>
					<div className={'m-auto h-auto'}>+</div>
					<input
						type={'file'}
						style={{ display: 'none' }}
						ref={fileInput}
						onChangeCapture={onFileChange}
						multiple
						accept={'image/*'}
					/>
				</div>

				{value?.map((image, index) => (
					<div
						key={fileImageKey(image)}
						className={
							'square relative mx-1 h-[clamp(120px,20vw,180px)] min-h-[120px] w-[clamp(120px,20vw,180px)] min-w-[120px] overflow-hidden rounded-2xl ring-1 ring-primary'
						}
						style={{
							flex: '0 0 auto',
						}}>
						<XCircle
							className={'absolute z-5 h-6 w-6 top-3 right-3 text-red-500 cursor-pointer'}
							onClickCapture={() => {
								removeImage(index);
							}}
						/>

						<FileImage
							source={(sourceGetter? sourceGetter(image) : image) ?? '/assets/logo-unavailable.svg'}
							style={{
								width: '100%',
								height: '100%',
								aspectRatio: '1',
								objectFit: 'cover',
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
