import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {type GetServerSidePropsContext} from 'next';
import {type DefaultSession, getServerSession, type NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {env} from '~/env';
import {db} from '~/server/db';
import {TRPCError} from '@trpc/server';
import sha1 from '~/utils/sha1';
import type {UserRole} from "@prisma/client";
import {routes} from "~/routes/router";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: DefaultSession['user'] & {
			id: string;
			role: UserRole;
		};
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	callbacks: {
		jwt: ({ session, user, profile, account, isNewUser, trigger, token }) => {
			if (account) {
				token.accessToken = account.access_token
				token.id = account.providerAccountId ?? user?.id
				token.role = (user as any)?.role ?? "GUEST"
			}
			return token;
		},
		session: ({ session, user, newSession, trigger, token }) => {
			// Send properties to the client, like an access_token and user id from a provider.
			return ({
				...session,
				user: {
					...session.user,
					id: token?.id,
					role: token?.role,
				},
			})
		},
	},
	pages:{
		signIn: routes.SignIn.route,
	},
	adapter: PrismaAdapter(db),
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text', placeholder: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			type: 'credentials',
			async authorize(credentials, req) {
				// Add logic here to look up the user from the credentials supplied
				if (!credentials) {
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'invalid credentials' });
				}
				const passwordHash = sha1(credentials.password);

				const user = await db.user.findUnique({
					where: { email: credentials.email },
				});
				if (user && user.passwordHash === passwordHash) {
					// Any object returned will be saved in `user` property of the JWT
					return user;
				} else {
					// If you return null then an error will be displayed advising the user to check their details.
					return null;

					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				}
			},
		}),
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
	secret: env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
		maxAge: 3600_000,
	},
	jwt: {
		secret: env.NEXTAUTH_SECRET,
	},
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext['req'];
	res: GetServerSidePropsContext['res'];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
