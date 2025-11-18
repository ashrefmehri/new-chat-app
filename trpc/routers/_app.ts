import { conversationsRouter } from '@/modules/conversations/server/procedure';
import {  createTRPCRouter } from '../init';
import { friendsRouter } from '@/modules/friends/server/procedure';
export const appRouter = createTRPCRouter({
conversations: conversationsRouter,
friends:friendsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;