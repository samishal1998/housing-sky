import { type NextPage } from 'next';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { FormikProvider, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { toast } from 'sonner';
import { FormikFormField } from '~/components/forms/formField';
import { FormikTextAreaField } from '~/components/forms/formTextAreaField';
import { Button } from '~/components/ui/button';
import { LoadingButton } from '~/components/loadingButton';
import { CreateRoomInput } from '~/server/api/routers/hotel/rooms/dtos/createRoomInput';
import { FormPhotoField } from '~/components/forms/formPhotoInput';
import { fileToBase64 } from '~/utils/fileToBase64';
import { FormikFormSelectField } from '~/components/forms/formSelectField';
import Layout from '~/components/layouts/layout';
import { RoomType } from '@prisma/client';
import { isCuid } from '@paralleldrive/cuid2';
import { getPublicImageUrlFromPath } from '~/utils/storage-helpers';

const CreateRoomFormSchema = CreateRoomInput.extend({
	images: z
		.any()
		.array()
		.min(1)
		.refine((arg) => {
			let totalSize = 0;
			for (const file of arg) {
				if (file instanceof File) {
					totalSize += file.size;
				}
			}

			return totalSize < 3000_000;
		}, 'Maximum Upload Size Reached'),
});
type CreateRoomFormValues = z.infer<typeof CreateRoomFormSchema>;
const CreateRoomDetails: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const createRoomMutation = api.hotels.rooms.create.useMutation();

	useEffect(() => {
		if (session.status === 'unauthenticated') {
			router.replace('/').catch(() => {
				alert("Couldn't redirect");
			});
		}
	}, [router, session.status]);

	const form = useFormik<CreateRoomFormValues>({
		initialValues: {
			name: '',
			description: '',
			floor: 0,
			space: '',
			pricePerDay: 0,
			vatPercentage: 0,
			type: 'SINGLE',
			images: [],
		},
		validationSchema: toFormikValidationSchema(CreateRoomFormSchema),
		async onSubmit(values, helpers) {
			try {
				const images: string[] = [];
				for (const image of values.images) {
					if (image instanceof File) {
						images.push(await fileToBase64(image));
					}
				}
				await createRoomMutation.mutateAsync({ ...values, images });
				toast('Created Room Successfully', { important: true });
				helpers.resetForm()
			} catch (e) {
				console.log(e);
				toast('Failed to Create Room', { important: true });
			}
		},
	});

	return (
		<Layout roleGuard={'HOTEL_MANAGER'}>
			<div className={'flex h-full items-center justify-center'}>
				<FormikProvider value={form}>
					<form className="flex w-full max-w-screen-md flex-col justify-center gap-4  px-6 py-12  lg:px-8">
						<h1 className={'w-full text-left text-2xl font-semibold'}>
							Add A New Room
						</h1>
						<FormPhotoField
							sourceGetter={(rawSource) => {
								if (typeof rawSource === 'string' && isCuid(rawSource))
									return getPublicImageUrlFromPath(rawSource);
								return rawSource;
							}}
							error={
								Array.isArray(form.errors.images)
									? form.errors.images[0]?.toString()
									: form.errors.images?.toString()
							}
							label={'Room Images'}
							value={form.values.images}
							onChange={form.handleChange('images') as any}
						/>
						<FormikFormField label={'Room Name'} name={'name'} />
						<FormikFormSelectField
							label={'Room Type'}
							name={'type'}
							required={true}
							options={[
								{ key: RoomType.SINGLE, content: 'Single' },
								{ key: RoomType.DOUBLE, content: 'Double' },
								{ key: RoomType.PRESIDENTIAL, content: 'Presidential' },
							]}
						/>
						<FormikFormField
							label={'Price Per Day (USD)'}
							name={'pricePerDay'}
							type={'number'}
							min={0}
						/>
						<FormikFormField
							label={'VAT %'}
							name={'vatPercentage'}
							min={0}
							type={'number'}
						/>
						<FormikFormField label={'Area'} name={'space'} />
						<FormikFormField label={'Floor'} name={'floor'} type={'number'} />
						<FormikTextAreaField label={'Description'} name={'description'} rows={5} />

						<Button asChild onClick={form.handleSubmit as any} type={'submit'}>
							<LoadingButton loading={form.isSubmitting}>Create Room</LoadingButton>
						</Button>
					</form>
				</FormikProvider>
			</div>
		</Layout>
	);
};
export default CreateRoomDetails;
