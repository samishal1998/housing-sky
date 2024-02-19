import { api } from '~/utils/api';
import { z } from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { FormikProvider, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { RegisterHotelInput } from '~/server/api/routers/hotel/dtos/registerHotelInput';
import { FormikFormField } from '~/components/forms/formField';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { LoadingButton } from '~/components/loadingButton';
import { FormikTextAreaField } from '~/components/forms/formTextAreaField';
import Link from 'next/link';
import { routes } from '~/routes/router';

const RegisterHotelFormSchema = RegisterHotelInput.extend({
	repeatPassword: z.string(),
}).refine((schema) => schema.password === schema.repeatPassword, { path: ['repeatPassword'],message:"Passwords Don't Match" });
type RegisterHotelFormValues = z.infer<typeof RegisterHotelFormSchema>;
export default function HotelRegistration() {
	const session = useSession();
	const registerHotelMutation = api.hotels.register.useMutation();

	const form = useFormik<RegisterHotelFormValues>({
		initialValues: {
			name: '',
			address: '',
			description: '',
			email: '',
			password: '',
			repeatPassword: '',
		},
		validationSchema: toFormikValidationSchema(RegisterHotelFormSchema),
		async onSubmit(values) {
			try {
				await registerHotelMutation.mutateAsync(values);
				toast('Registered Successfully', { important: true });
				await signIn("credentials",values)

			} catch (e) {
				console.log(e);
				toast('Failed to register', { important: true });
			}

		},
	});
	if (session.status === 'loading') {
		return <>Loading...</>;
	}
	return (


		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<Link href="/" className="block sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						className="mx-auto h-40 w-auto"
						src="/housing-sky-logo.svg"
						alt="Housing Sky"
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Hotel Registration
					</h2>
				</Link>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<FormikProvider value={form}>
						<form className="space-y-5">
							<FormikFormField label={'User Name'} name={'username'} />
							<FormikFormField label={'User Email'} name={'email'} />
							<FormikFormField label={'Password'} name={'password'} />
							<FormikFormField label={'Repeat Password'} name={'repeatPassword'} />
							<div className={'flex flex-row items-center justify-center w-full gap-2'}>
								<div className={'flex-1 bg-primary/40 h-0.5 rounded-full '}></div>
								<div className={'text-primary/50 font-semibold text-lg'}>Hotel Details</div>
								<div className={'flex-1 bg-primary/40 h-0.5 rounded-full '}></div>
							</div>
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
										Sign up
									</LoadingButton>
								</Button>
							</div>
						</form>
					</FormikProvider>

					<Link
						className="mt-10 block cursor-pointer text-center text-sm text-gray-500 hover:underline"
						href={routes.SignUp.generatePath()}>
						Want to register as a guest?
					</Link>
					<p
						className="mt-3 cursor-pointer text-center text-sm text-gray-500 hover:underline"
						onClick={() => signIn(undefined, { callbackUrl: '/' })}>
						Already a member, Sign In?
					</p>
				</div>
			</div>
		</>
	);
}
