import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import sha1 from '~/utils/sha1';
import { CreateUserInput } from '~/server/api/routers/user/dtos/createUserInput';
import { assert } from '~/utils/assert';
import { uploadFileFromBase64 } from '~/server/firebase-storage';
import { TRPCError } from '@trpc/server';
import { UpdateUserInput } from '~/server/api/routers/user/dtos/updateUserInput';
import { GetUserInput } from '~/server/api/routers/user/dtos/getUserInput';

export const usersRouter = createTRPCRouter({
	create: publicProcedure.input(CreateUserInput).mutation(async ({ ctx, input }) => {
		const { email, name, password } = input;
		const passwordHash = sha1(password);

		return ctx.db.user.create({
			data: {
				name: name,
				email,
				passwordHash,
			},
		});
	}),

	get: publicProcedure.input(GetUserInput).query(async ({ ctx, input }) => {
		assert(!!input?.userId || ctx?.session?.user?.id, 'Please Provide UserID');

		const userId = input?.userId ?? ctx.session?.user?.id;
		const user = await ctx.db.user.findUnique({
			where: { id: userId },
		});

		assert(user, 'user-not-found', 'NOT_FOUND');

		user!.passwordHash = null;
		return { user };
	}),

	update: protectedProcedure.input(UpdateUserInput).mutation(async ({ ctx, input }) => {
		const { name, password, image } = input;

		const fields: any = {};
		if (password) {
			fields.passwordHash = sha1(password);
		}
		if (image) {
			try {
				await uploadFileFromBase64(ctx.firebaseApp, ctx.session.user.id, image);
			} catch (e) {
				throw new TRPCError({
					message: 'image-upload-failed',
					code: 'INTERNAL_SERVER_ERROR',
				});
			}
		}
		return ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: {
				name,
				...fields,
			},
		});
	}),
});
