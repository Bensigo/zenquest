import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { queryOpenAi } from "@/utils/openai";
import { DailyQuestActivity, Level } from "@prisma/client";
import { getLevel } from "../utils";
import { createChat } from "./chat";

interface Activity {
  title: string;
  duration: string;
  description: string;
}

const dailyActivityEnum = Object.values(
  DailyQuestActivity as { [key: string]: string }
) as [string, ...string[]];

function parseActivities(input: string): Activity[] {
  const activities = JSON.parse(input) as Activity[];
  return activities;
}

export const activityRouter = createTRPCRouter({
  getActivites: protectedProcedure
    .input(z.object({ mood: z.number(), questId: z.string() }))
    .query(async ({ ctx, input }) => {
        try {
          const prisma = ctx.prisma;

          // const quest = await ctx.prisma.quest.findUnique({ where: { id: input.questId }, include: { goal: true }})
          const quest = await prisma.quest.findFirst({
            where: {  id : input.questId },
            include: { goal: true }
          });
    
          if(!quest){
            throw new Error('invlaid quest')
          }
          if (!quest.goal)return [];
          const goal = (quest.goal).name;
          const prompt = `
          Imagine yourself as a specialist, someone with a mood of ${input.mood} in a scale of 1-10
          Can you recommend three activities for the day that can empower him/her to reach thier goal? 
          These activities should contribute to thier pursuit of ${goal}. Please provide your response in the form of a JavaScript array of objects, with each object containing a title, duration, and a concise description (maximum 150 characters). 
            `.trim();
    
    
          const rawActivitiyResponse = await queryOpenAi(prompt).catch((err: unknown) => {
            console.log({ err })
          })
          
    
          console.log({ rawActivitiyResponse })
          if (!rawActivitiyResponse) {
            throw new Error("Oops something went wrong");
          }
          const activities = parseActivities(rawActivitiyResponse);
          console.log({ activities })
    
          return activities;
        }
        catch (err: unknown){
          console.log(err)
          throw err;
        }
    }),
  startQuestActivity: protectedProcedure
    .input(
      z.object({
        type: z.enum(dailyActivityEnum),
        id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      // create a new activity if that activity don't exist for the day,
      //  if it exit throw and error
      // else create an activity and add a score
      const prisma = ctx.prisma;
      const userId = ctx.session.user.id;

      const { type, id } = input;
      const quest = await prisma.quest.findFirst({
        where: { userId, id  },
        include: { goal: true }
      });

      if (!quest) {
        throw new Error("Quest not found");
      }
     
      if (!quest.goal){
        throw new Error('Invalid quest')
      }

      const isChat = type.toLowerCase() === DailyQuestActivity.Chat.toString().toLowerCase();
      if (isChat){
        // create a new  chat ;
        const goal = (quest.goal).name;
        await createChat(prisma, goal, userId, quest.id)

      }

      const currentDay = new Date(); // Current date
      const currentDayStart = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate()
      );

      const questId = quest.id;
      const exitingActivity = await prisma.dailyActivity.findFirst({
        where: {
          questId,
          createdAt: {
            gte: currentDayStart,
            lt: new Date(currentDayStart.getTime() + 24 * 60 * 60 * 1000),
          },
          type: type as DailyQuestActivity,
        },
      });

      if (exitingActivity?.isCompleted) {
        throw new Error("this activity have been done");
      }

      if (exitingActivity) return exitingActivity;

      const score = 10; // point awarded

      let profile = await prisma.profile.findFirst({ where: { userId } });

      if (!profile) {
        profile = await prisma.profile.create({
          data: { level: Level.Eden, userId },
        });
      }

      const currentProfileScore = profile.score + score;



      const level = getLevel(currentProfileScore);

      if (!level) {
        throw new Error("Oops try again");
      }
 

      // update user score and create activity
      await prisma.profile.update({
        where: { userId },
        data: {
          score: currentProfileScore,
          level: level,
        },
      });

      // if type is therapy create a conversation

      const activity = await prisma.dailyActivity.create({
        data: {
          type: type as DailyQuestActivity,
          point: score,
          questId,
          isCompleted: false,
        },
      });
      return activity;
    }),
  completeQuestActivity: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        chatSessionId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.session.user.id

      const profile = await prisma.profile.findFirst({ where: { userId }});

      if(!profile){
        throw new Error('user not found')
      }
      const chatId = input.chatSessionId

      if (chatId){
       
          const session = await prisma.dailyTherapySession.findUnique({ where: { id: chatId }});
          if (!session){
            throw new Error('Invalid chat session')
          }
           await prisma.dailyTherapySession.update({ where: { id: chatId }, data: { isActive: false }})
      }

      const activity = await prisma.dailyActivity.findFirst({
        where: {
          id: input.id,
          isCompleted: false,
          quest: {
            userId,
          },
        },
        include: { quest: true },
      });

      if (!activity) {
        throw new Error("Activiy does not exit");
      }

   
      const currentScore = 50 + profile.score;
      const currentLevel = getLevel(currentScore);

      await prisma.profile.update({
        where: {
          userId 
        },
        data: {
          score: currentScore,
          level: currentLevel,
        }
      })

     

      const currentActivity = await prisma.dailyActivity.update({
        where: {
          id: input.id
        },
        data: {
          isCompleted: true,
         
        },
        include: {
          quest: true
        }
      })
      return currentActivity;
    }),
    getActiveDailyActivity: protectedProcedure.input(z.object({
      type: z.enum(dailyActivityEnum)
    })).query(async ({ ctx, input }) => {

      const activity  = ctx.prisma.dailyActivity.findFirst({
        where: {
          type: input.type as DailyQuestActivity,
          isCompleted: false,
          quest: {
            userId: ctx.session.user.id,
          }
        },
        include: {
          quest: true
        }
      })
      
      return activity;

    }),
    getActiveStep: protectedProcedure.input(z.object({
      id: z.string()
    })).query(async ({ ctx , input}) => {
      const questId = input.id;

      const currentDay = new Date(); // Current date
      const currentDayStart = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate()
      );

      const count = await ctx.prisma.dailyActivity.count({
        where: {
          questId,
          isCompleted: true,
          createdAt: {
            gte: currentDayStart,
            lt: new Date(currentDayStart.getTime() + 24 * 60 * 60 * 1000),
          }
        },
      })

      return { count }
    })
});

/**
 * Eden: 0 - 100
Alpha: 201 - 1000
Omega: 1001 - 6000
Titan: 6001 - 15000
Zenith: 15001 - 40000
GodMode: 400001 - INFINITY
 * 
 */

