import { extractArrayFromString, queryOpenAi } from "@/server/api/utils/openai";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { kv } from "@vercel/kv";

const aiPromptForAffirmations = `I want you to generate 8 affirmation, to brighting my day. return answer in an array format, without indexing`

export function rawDataToAffirmations(inputString: string): string[] {
  if (!inputString) return [];
  try {
    const affirmations: string[] = [];
    const lines = inputString.split('\n');
    for (const line of lines) {
      const matches = line.match(/"([^"]+)"/);
      if (matches && matches.length >= 2) {
        affirmations.push((matches[1] as string));
      }
    }

    return affirmations;
  } catch (error: unknown) {
    console.log({ error });
    return [];
  }
}

export const affirmationRoutes = createTRPCRouter({
    getDailyAffirmations: protectedProcedure.query(async ({ ctx }) => {
        const prisma = ctx.prisma;
        const user = ctx.session.user;
        const cacheKey = `${user.id}_daily_affirmations`;


        if (process.env.VERCEL_ENV === 'production'){
          const cacheAffirmations = await kv.get<string[]>(cacheKey);
    
          if (cacheAffirmations && cacheAffirmations.length){
            return cacheAffirmations;
          }
          
        }
    

        const prompt = aiPromptForAffirmations;
        const quest = await prisma.quest.findFirst({
          where: {
            userId: user.id,
            isActive: true,
            deleted: false
          }
        });

        let rawResp;
        if (!quest?.affirmationCategories){
           // return random affirmation for the day
           rawResp = (await queryOpenAi(prompt)) as string
           if (!rawResp){
            throw new Error('Opps something went wrong try again')
          }

           return rawDataToAffirmations(rawResp)
        }

   
        const questPrompt = `I want you to generate 6 affirmation, to brighting my day focusing on this list ${quest.affirmationCategories.join(',')}.`
        rawResp = (await queryOpenAi(questPrompt)) as string
        

      if (!rawResp){
        throw new Error('Opps something went wrong try again')
      }
      const affirmations = extractArrayFromString(rawResp);

      if (process.env.VERCEL_ENV === 'production'){
            // cache affirmations 
            await kv.set(cacheKey, affirmations, {
              ex: 86400
            })
      }
    

      return affirmations
      

    }),
    getQuestAffirmation: protectedProcedure.query(async ({ ctx }) => {
      const prisma = ctx.prisma;
      const user = ctx.session.user;

     
      const cacheKey = `${user.id}_affirmations`;

      if (process.env.VERCEL_ENV === 'production'){

              
      const cacheAffirmations = await kv.get<string[]>(cacheKey);

      if (cacheAffirmations && cacheAffirmations.length){
        return cacheAffirmations;
      }
        
      }




      const quest = await prisma.quest.findFirst({
        where: {
          userId: user.id,
          isActive: true,
          deleted: false
        }
      });

      if (!quest){
        return;
      }

      const prompt = `I want you to generate 6 affirmation, to brighting my day focusing on this list ${quest.affirmationCategories.join(',')}.`

      const rawResp = (await queryOpenAi(prompt)) as string
    
      const affirmations = extractArrayFromString(rawResp);
      
      if (process.env.VERCEL_ENV === 'production'){
          // cache affirmations 
      await kv.set(cacheKey, affirmations, {
        ex: 86400
      })
      }
     

      return affirmations;
    })
})