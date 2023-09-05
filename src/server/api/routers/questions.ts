import { extractQuestionsFromString, queryOpenAi } from "@/utils/openai";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";




export const questionRouter = createTRPCRouter({
   getDailyQuestion: protectedProcedure
   .input(z.object({ mood: z.number().min(1).max(10) }))
   .mutation(async ({ input }) => {
     const mood = input.mood;
      //TODO:  check if cache availble the return cache data, the ttl should be for 1 hour
      // NOTE: prompt should always be revise every 10 days untill perfect prompt is found
      const prompt = `
      I want you to act as a mental health advice (therapist). A person with a mode of ${mood} on a scale 
      of 1-10, what are the  5 questions about his/her day,  be precise and return the answer in a list. Thanks
      `;

      const rawDailyQuestions: string =(await queryOpenAi(prompt) )as string;
      const questions = extractQuestionsFromString(rawDailyQuestions)
      return questions;
   })
})