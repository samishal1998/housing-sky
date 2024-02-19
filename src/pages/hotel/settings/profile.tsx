import { api } from '~/utils/api';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { FormikProvider, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { FormikFormField } from '~/components/forms/formField';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { LoadingButton } from '~/components/loadingButton';
import { FormikTextAreaField } from '~/components/forms/formTextAreaField';
import { UpdateHotelInput } from '~/server/api/routers/hotel/dtos/updateHotelInput';
import Layout from '~/components/layouts/layout';
import { CircularProgress } from '~/components/circularProgress';
import { getPublicImageUrlFromPath } from '~/utils/storage-helpers';
import * as React from 'react';
import { fileToBase64 } from '~/utils/fileToBase64';
import { AvatarFormField } from '~/components/forms/avatarFormField';

const UpdateHotelFormSchema = UpdateHotelInput.extend({
	image:z.any().optional()
});

type UpdateHotelFormValues = z.infer<typeof UpdateHotelFormSchema>;
export default function HotelRegistration() {
	const session = useSession();
	const hotelQuery = api.hotels.get.useQuery();
	const updateHotelMutation = api.hotels.update.useMutation();

	const form = useFormik<UpdateHotelFormValues>({
		initialValues: {
			name: hotelQuery.data?.name,
			address: hotelQuery.data?.address,
			description: hotelQuery.data?.description ?? '',
		},
		enableReinitialize:true,
		validationSchema: toFormikValidationSchema(UpdateHotelFormSchema),
		async onSubmit(values) {
			try {
				let image: string |undefined = undefined;

					if (values.image instanceof File) {
						image = await fileToBase64(values.image);
					}

				await updateHotelMutation.mutateAsync({...values,image});
				toast('Updated Successfully', { important: true });
			} catch (e) {
				console.log(e);
				toast('Failed to Update', { important: true });
			}
		},
	});
	if (session.status === 'loading') {
		return <>Loading...</>;
	}
	return (
		<Layout roleGuard={'HOTEL_MANAGER'}>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				{!hotelQuery.data ? (
					<CircularProgress />
				) : (
					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<FormikProvider value={form}>
							<form className="space-y-5">
								<AvatarFormField
									value={form.values.image ?? hotelQuery.data.id}
									fallbackName={hotelQuery.data.name}
									onChange={async (file: File)=>{
										await form.setFieldValue('image',file)
									}}
								/>

								<FormikFormField label={'Hotel Name'} name={'name'} />
								<FormikFormField label={'Address'} name={'address'} />
								<FormikTextAreaField
									label={'Description'}
									name={'description'}
									rows={5}
								/>
								<div>
									<Button asChild>
										<LoadingButton
											className={'w-full'}
											onClick={form.handleSubmit as any}
											loading={form.isSubmitting}>
											Update
										</LoadingButton>
									</Button>
								</div>
							</form>
						</FormikProvider>
					</div>
				)}
			</div>
		</Layout>
	);
}

