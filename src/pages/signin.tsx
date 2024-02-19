import {signIn, useSession} from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { api } from '~/utils/api';
import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { LoadingButton } from '~/components/loadingButton';
import { FormField } from '~/components/forms/formField';
import {Button} from "~/components/ui/button";
import {toast} from "sonner";
import {routes} from "~/routes/router";
import Link from "next/link";

const SignInFormSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})
type SignInFormValues = z.infer<typeof SignInFormSchema>;

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
    const form = useFormik<SignInFormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: toFormikValidationSchema(SignInFormSchema),
        async onSubmit(values) {
            try {
                await signIn("credentials",values)
                toast('Signed In Successfully', { important: true });

            } catch (e) {
                console.log(e);
                toast('Failed to SignIn', { important: true });
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
                    <img
                        className="mx-auto h-40 w-auto"
                        src="/housing-sky-logo.svg"
                        alt="Housing Sky"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign In
                    </h2>
                </Link>



                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-5">

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


                        <div>
                            <Button asChild>
                                <LoadingButton
                                    className={'w-full'}
                                    onClick={form.handleSubmit as any}
                                    loading={createUserMutation.isLoading}>
                                    Sign In
                                </LoadingButton>
                            </Button>
                        </div>
                    </form>

                    <Link href={routes.SignUp.generatePath()} className="block mt-10 text-center text-sm text-gray-500 cursor-pointer" >
                        Not A Member, Sign Up?
                    </Link>
                </div>
            </div>
        </>
    );
}
