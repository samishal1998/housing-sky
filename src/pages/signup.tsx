import {signIn, useSession} from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { api } from '~/utils/api';
import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { LoadingButton } from '~/components/loadingButton';
import { FormField } from '~/components/forms/formField';
import {CreateUserInput} from "~/server/api/routers/user/dtos/createUserInput";
import {Button} from "~/components/ui/button";
import {toast} from "sonner";
import Link from "next/link";
import { routes } from '~/routes/router';
import Image from "next/image";

const CreateUserFormSchema = CreateUserInput.extend({
	repeatPassword: z.string(),
}).refine((schema) => schema.password === schema.repeatPassword, { path: ['repeatPassword'],message:"Passwords Don't Match" });

type CreateUserFormValues = z.infer<typeof CreateUserFormSchema>;

export default function RegistrationPage() {
	const router = useRouter();
	const session = useSession();
	const createUserMutation = api.users.create.useMutation();

	useEffect(() => {
		if (session.status === 'authenticated') {
			router.replace('/').catch(() => {
				alert("Couldn't redirect");
			});
		}
	}, [router, session.status]);
	const form = useFormik<CreateUserFormValues>({
		initialValues: {
			email: '',
			name: '',
			password: '',
			repeatPassword: '',
		},
		validationSchema: toFormikValidationSchema(CreateUserFormSchema),
		async onSubmit(values) {

			try {
				await createUserMutation.mutateAsync(values);
				toast('Signed Up Successfully', { important: true });
				await signIn("credentials",values)

			} catch (e) {
				console.log(e);
				toast('Failed to Sign Up', { important: true });
			}
		},
	});

	if (session.status === 'loading' || session.status === 'authenticated') {
		return <>Loading...</>;
	}


	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<Link href='/' className="block sm:mx-auto sm:w-full sm:max-w-sm">
					<Image
						className="mx-auto h-40 w-auto"
						src="/housing-sky-logo.svg"
						alt="Housing Sky"
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Sign Up
					</h2>
				</Link>


				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-5">
						<FormField
							label={'Name'}
							name={'name'}
							value={form.values.name}
							onChange={form.handleChange('name')}
							error={form.errors.name}
							required
							inputProps={{
								autoComplete: 'name',
							}}
						/>
						<FormField
							label={'Email address'}
							name={'email'}
							value={form.values.email}
							onChange={form.handleChange('email')}
							error={form.errors.email}
							required
							inputProps={{
								autoComplete: 'email',
							}}
						/>
						<FormField
							label={'Password'}
							name={'password'}
							value={form.values.password}
							onChange={form.handleChange('password')}
							error={form.errors.password}
							required
							inputProps={{
								autoComplete: 'current-password',
								type: 'password',
							}}
						/>
						<FormField
							label={'Repeat Password'}
							name={'repeatPassword'}
							value={form.values.repeatPassword}
							onChange={form.handleChange('repeatPassword')}
							error={form.errors.repeatPassword}
							required
							inputProps={{
								autoComplete: 'current-password',
								type: 'password',
							}}
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

					<Link className="block mt-10 text-center hover:underline text-sm text-gray-500 cursor-pointer" href={routes.HotelRegistration.generatePath()}>
						Want to register as a hotel?
					</Link>
					<p className="mt-3 text-center hover:underline text-sm text-gray-500 cursor-pointer" onClick={()=>signIn(undefined,{callbackUrl:'/'})}>
						Already a member, Sign In?
					</p>
				</div>
			</div>
		</>
	);
}
