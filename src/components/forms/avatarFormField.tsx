import { bindFileInputElement, useFileInput } from '~/hooks/useFileInput';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { FileImage } from '~/components/forms/file-image';
import { getPublicImageUrlFromPath } from '~/utils/storage-helpers';
import { Button } from '~/components/ui/button';
import { PencilIcon, XCircle } from 'lucide-react';
import * as React from 'react';

export function AvatarFormField({
	value,
	onChange,
	fallbackName,
}: {
	value?: File | string;
	onChange: any;
	fallbackName: string;
}) {
	const fileInput = useFileInput({
		single: true,
		mimeType: 'image/*',
		onFileChangeCallback: (e) => {
			const files = e.target.files ? Array.from(e.target.files) : [];
			onChange?.(files[0]);
		},
	});

	return (
		<div className={'relative w-full'}>
			<Avatar className={'mx-auto aspect-square h-auto w-[80%] font-bold'}>
				{value instanceof File ? (
					<FileImage source={value} />
				) : (
					<AvatarImage src={value ? getPublicImageUrlFromPath(value) : value} />
				)}
				<AvatarFallback
					className={'bg-primary/30 text-[5rem] font-normal text-neutral-600'}>
					{fallbackName.replaceAll(/(\w)\w+\s*/g, '$1')}
				</AvatarFallback>
			</Avatar>
			{value instanceof File && (
				<Button
					size={'icon'}
					type={'button'}
					variant={'secondary'}
					className={'absolute left-[17%] top-[9%]'}
					onClick={() => onChange?.(undefined)}>
					<XCircle className={'text-destructive'} />
				</Button>
			)}
			<Button
				size={'icon'}
				type={'button'}
				variant={'secondary'}
				className={'absolute right-[17%] top-[9%]'}
				onClick={() => fileInput.openInput()}>
				<PencilIcon />
			</Button>
			<input {...bindFileInputElement(fileInput)} />
		</div>
	);
}
