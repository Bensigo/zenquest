import { createTRPCRouter } from "@/server/api/trpc";
import { journalRouter } from "./routers/journal";
import { questionRouter } from "./routers/questions";
import { metricRouter } from "./routers/metric";
import { profileRouter } from "./routers/profile";
import { affirmationRoutes } from "./routers/affirmation";
import questRouter from "./routers/quest";
import { chatRouter } from "./routers/chat";
import { activityRouter } from "./routers/activities";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  journal: journalRouter,
  question: questionRouter,
  metric: metricRouter,
  profile: profileRouter,
  affirmation: affirmationRoutes,
  quest:  questRouter,
  chat: chatRouter,
  activity: activityRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
