import { z } from "zod";

import { extractArrayFromString, queryOpenAi } from "@/utils/openai"; // Provide the correct relative path to the queryOpenAi function
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { addDays, isSameDay } from "date-fns";
import { type Quest } from "@prisma/client";
import { prisma } from "@/server/db";
import { getLevel } from "../utils";
import { TRPCError } from "@trpc/server";

const questRouter = createTRPCRouter({
  createGoal: protectedProcedure
    .input(
      z.object({
        goal: z.string(),
        endDate: z.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.session.user.id;
      const goal = input.goal;

      if (isSameDay(new Date(), input.endDate)){
        throw new Error('Invalid date')
      }
      // Add prompt for getting 1 suggested affirmations categories based on the user's goals
      const affirmationPrompt = `Provide me with an array of 3  categories(in one or two words) for affirmation related to my goal: 
      ${goal}. repsonse in javascript array`;

      const rawSuggestedCategories: string = (await queryOpenAi(
        affirmationPrompt,
        0.2
      ).catch((error: Error) => {
        console.log({ error });
        throw new Error("Oops something went worng try again");
      })) as string;

      let extractedAffirmationCategories = []
      if (typeof JSON.parse(rawSuggestedCategories) === 'object'){
        extractedAffirmationCategories =  JSON.parse(rawSuggestedCategories) as string[]
      }else {
        extractedAffirmationCategories = extractArrayFromString(
          rawSuggestedCategories
        )
      }

  

       if (!extractedAffirmationCategories.length){
        throw new Error("Oops something went worng try again");
       }

      
       
        const today = new Date()
        // create a quest
        const quest: Quest = await prisma.quest.create({
          data: {
            suggestedAffirmationCategories: extractedAffirmationCategories,
            isActive: true,
            isGoalSetup: true,
            endDate: input.endDate,
            userId,
          }
        })

        await prisma.goal.create({
          data: {  name: goal, questId: quest.id }
        })
      
      return quest;
      

      //
    }),
  updatedQuestAffirmation: protectedProcedure
    .input(
      z.object({
        categories: z.array(z.string()),
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const prisma = ctx.prisma;

      const quest = await prisma.quest.findFirst({ where: { userId: userId, id: input.id }})
      if (!quest){
         throw new Error('quest not found')
      }
      const updatedQuest = await prisma.quest.update({
        where: {
          id: input.id
        },
        data: {
          affirmationCategories: input.categories,
          hasAffirmationCategories: true
        }
      })
      return updatedQuest;
    }),

    getActiveQuest: protectedProcedure.query(async ({ ctx}) => {
      const prisma = ctx.prisma;
      const userId = ctx.session.user.id;

        const quest = await prisma.quest.findFirst({
          where: {
            userId,
            isActive: true
          },
          include: {
            goals: true
          }
        })
        return quest;
    }),

    closeQuest: protectedProcedure
    .input(z.object({ id: z.string()}))
    .mutation(async ({ ctx, input }) => {

      const profile = await prisma.profile.findFirst({ where: { userId: ctx.session.user.id} })

      if (!profile){  
        throw new TRPCError({ message: 'user not found', code:  'NOT_FOUND' })
      }

      const quest = await ctx.prisma.quest.findFirst({ where : { id: input.id, userId: ctx.session.user.id }})

      if (!quest){
        throw new Error('Quest not found')
      }
     
      const currentScore = 300 + profile.score;
      const level = getLevel(currentScore);

      await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          score: currentScore,
          level
        }
      })

      await ctx.prisma.quest.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: false
        }
      })
    }),
    list: protectedProcedure.input(z.object({
      filter: z.enum(['all','active', 'inactive']).optional(),
      skip: z.number().optional(),
      take: z.number().optional(),
    }))
    .query(async ({ input, ctx }) => {
      // code 
      const { prisma, session } = ctx;
      const { skip = 0, take = 10 , filter } = input;
    
      const isActive = filter === 'active';
      const userId = session.user.id;

      const quests = await prisma.quest.findMany({
        where: {
          userId,
        ...( filter === 'all' ? { }: { isActive } )
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          goal: true
        }
      })

      return quests;

    }),
    get: protectedProcedure.input(z.object(
      {
        id: z.string()
      }
    )).query(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.session.user.id;

      const quest = await ctx.prisma.quest.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          goal: true
        }
      })
      return quest;
    })
});

export default questRouter;
