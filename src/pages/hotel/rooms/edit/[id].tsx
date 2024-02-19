import { type NextPage } from 'next';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useMemo } from 'react';
import { FormikProvider, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { toast } from 'sonner';
import { FormikFormField } from '~/components/forms/formField';
import { FormikTextAreaField } from '~/components/forms/formTextAreaField';
import { Button } from '~/components/ui/button';
import { LoadingButton } from '~/components/loadingButton';
import { EditRoomInput } from '~/server/api/routers/hotel/rooms/dtos/editRoomInput';
import Layout from '~/components/layouts/layout';
import { FormikFormSelectField } from '~/components/forms/formSelectField';
import { FormPhotoField } from '~/components/forms/formPhotoInput';
import { CircularProgress } from '~/components/circularProgress';
import { fileToBase64 } from '~/utils/fileToBase64';
import { RoomType } from '@prisma/client';
import { isCuid } from '@paralleldrive/cuid2';
import { getPublicImageUrlFromPath } from '~/utils/storage-helpers';

const EditRoomFormSchema = EditRoomInput.extend({
	images: z
		.union(
			[z.string(), z.instanceof(File)]
		)
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
type EditRoomFormValues = z.infer<typeof EditRoomFormSchema>;

const EditRoomDetails: NextPage = () => {
	const query = useRouter().query;

	const editRoomMutation = api.hotels.rooms.edit.useMutation();
	const roomDetailsQuery = api.hotels.rooms.get.useQuery({ roomId: query.id as string });
	const roomDetails = useMemo(() => roomDetailsQuery.data?.room, [roomDetailsQuery]);

	const form = useFormik<EditRoomFormValues>({
		initialValues: {
			name: roomDetails?.name,
			description: roomDetails?.description ?? '',
			roomId: roomDetails?.id ?? '',
			type: roomDetails?.type,
			floor: roomDetails?.floor,
			space: roomDetails?.space,
			pricePerDay: roomDetails?.pricePerDay,
			vatPercentage: roomDetails?.vatPercentage,
			images: roomDetails?.images ?? [],
		},enableReinitialize:true,
		validationSchema: toFormikValidationSchema(EditRoomFormSchema),
		async onSubmit(values) {
			try {
				const images: string[] = [];
				for (const image of values.images ?? []) {
					if (image instanceof File) images.push(await fileToBase64(image));
					else images.push(image);
				}
				await editRoomMutation.mutateAsync({ ...values, images });
				toast('Edited Room Successfully', { important: true });
			} catch (e) {
				console.log(e);
				toast('Failed to Edit Room', { important: true });
			}
		},
	});

	return (
		<Layout roleGuard={"HOTEL_MANAGER"}>
			{roomDetailsQuery.isLoading  || !roomDetails? (
				<CircularProgress />
			) : (
				<div className={'flex h-full flex-col items-center justify-center'}>
					<FormikProvider value={form}>
						<form className="flex w-full max-w-screen-md flex-col justify-center gap-4  px-6 py-12  lg:px-8">
							<h1 className={'w-full text-left text-2xl font-semibold'}>
								Edit Room ({roomDetails?.name})
							</h1>
							<FormPhotoField
								error={
									Array.isArray(form.errors.images)
										? form.errors.images[0]?.toString()
										: form.errors.images?.toString()
								}
								sourceGetter={(rawSource) => {
									if (typeof rawSource === 'string' && isCuid(rawSource))
										return getPublicImageUrlFromPath(rawSource);
									return rawSource;
								}}
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
									{ key: RoomType.PRESDENTIAL, content: 'Presidential' },
								]}
							/>

							<FormikFormField
								label={'Price Per Day'}
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
							<FormikTextAreaField
								label={'Description'}
								name={'description'}
								rows={5}
							/>
							<Button asChild onClick={form.handleSubmit as any} type={'submit'}>
								<LoadingButton loading={form.isSubmitting}>Edit Room</LoadingButton>
							</Button>
						</form>
					</FormikProvider>
				</div>
			)}
		</Layout>
	);
};
export default EditRoomDetails;
