import { api } from '~/utils/api';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { FormikProvider, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { FormikFormField } from '~/components/forms/formField';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { LoadingButton } from '~/components/loadingButton';
import Layout from '~/components/layouts/layout';
import { CircularProgress } from '~/components/circularProgress';
import * as React from 'react';
import { useMemo } from 'react';
import { fileToBase64 } from '~/utils/fileToBase64';
import { AvatarFormField } from '~/components/forms/avatarFormField';

const UpdateHotelFormSchema = z
	.object({
		name: z.string().optional(),
		email: z.string().email().optional(),
		password: z.string().optional(),
		repeatPassword: z.string().optional(),
		image: z.any().optional(),
	})
	.refine((schema) => schema.password === schema.repeatPassword, {
		path: ['repeatPassword'],
		message: "Passwords Don't Match",
	});

type UpdateHotelFormValues = z.infer<typeof UpdateHotelFormSchema>;
export default function HotelRegistration() {
    const session = useSession();
    const userQuery = api.users.get.useQuery();
    const user = useMemo(()=>userQuery.data?.user,[userQuery])
    const updateUserMutation = api.users.update.useMutation();

    const form = useFormik<UpdateHotelFormValues>({
        initialValues: {
            name: user?.name ?? undefined,
            email: user?.email ?? undefined,
            image:undefined,
        },
        validationSchema: toFormikValidationSchema(UpdateHotelFormSchema),
        async onSubmit(values) {
            try {
                let image: string |undefined = undefined;

                if (values.image instanceof File) {
                    image = await fileToBase64(values.image);
                }

                await updateUserMutation.mutateAsync({...values,image});
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
        <Layout roleGuard={'SIGNED_IN'}>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                {!user ? (
                    <CircularProgress />
                ) : (
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <FormikProvider value={form}>

                            <form className="space-y-5">
                                <AvatarFormField
                                    value={form.values.image ?? (user.id)}
                                    fallbackName={user.name ?? ""}
                                    onChange={async (file: File)=>{
                                        await form.setFieldValue('image',file)
                                    }}
                                />

                                <FormikFormField label={'User Name'} name={'name'} />
                                <FormikFormField label={'Email'} name={'email'} />
                                <FormikFormField label={'Password'} name={'password'} />
                                <FormikFormField label={'Repeat Password'} name={'repeatPassword'} />

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

