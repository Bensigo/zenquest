import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Level } from "@prisma/client";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId,
      },
    });
    return profile;
  }),
  createOrUpdateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        preferences: z.array(z.string().optional()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const name = input.name;
      const preferences = input.preferences;
      const prisma = ctx.prisma;
      const userId = ctx.session.user.id;

      const profile = await prisma.profile.findUnique({ where: { userId }});

      if (!profile){
        const currentProfile = prisma.profile.create({
          data: {
            userId,
            ...( name ? { name } : { }),
            ...( preferences?.length > 1 ? { perference: preferences as string [] } : { }),
            level: Level.Eden
          }
        })
        return currentProfile;
      }

      // update profile
      const updatedProfile =  await prisma.profile.update({
        where: {
          id: profile.id
        },
        data: {

          ...( name ? { name } : { }),
          ...( preferences?.length > 1 ? { perference: preferences as string [] } : { }),
        }
      })
      return updatedProfile
    }),
});
