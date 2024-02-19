
import { createTRPCRouter } from "~/server/api/trpc";
import {roomsRouter} from "~/server/api/routers/rooms";
import {usersRouter} from "~/server/api/routers/user";
import {hotelsRouter} from "~/server/api/routers/hotel";
import {guestRouter} from "~/server/api/routers/guest";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users:  usersRouter,
  hotels:  hotelsRouter,
  guest:  guestRouter,
  rooms:  roomsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
