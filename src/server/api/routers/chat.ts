import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { addMinutes } from "date-fns";
import { chatCompletionAi } from "@/utils/openai";
import { PrismaClient } from "@prisma/client";

const startTherapyPrompt = (goal: string) => `You step into the role of a compassionate therapist,
 dedicated to guiding someone towards their goal of '${goal}'. for today session, what thoughtful 
question will you use to initiate this transformative conversation?
`;



export const chatRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ focus: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const focus = input.focus;

      const today = new Date();
      const startTime = today;
      const endTime = addMinutes(startTime, 6);
      

      // get active quest for the user
      const quest = await prisma.quest.findFirst({
        where: { userId: ctx.session.user.id, isActive: true },
      });


      if (!quest) {
        throw new Error("therapy session can not be created");
        return;
      }

      // check if user already have an active sessaion
      const existingSession = await prisma.dailyTherapySession?.findMany({
        where: {
          questId: quest.id,
          focus,
        },
        include: {
          messages: true
        }
      });
      // starting an exiting quest daily session for focus
       if (existingSession.length){
        const conversation = existingSession.map((session) => {
          const messages = session.messages.map((msg) => ({ role: msg.sender, content: msg.content }))
          return messages;
        }).flat()
        // a promp to continue the chat
        const prompt =  'Can we continue the session, starting with a new day?' // add prompt
        const messages = [...conversation, { role: 'user', content: prompt }]
        
        const startConvoResp = await chatCompletionAi(messages);

     
        if (!startConvoResp){
          throw new Error('oops something went wrong')
          return;
        }
        // create a new session with is root false
        await prisma.dailyTherapySession.create({
          data: {
            questId: quest.id,
            start: startTime,
            end: endTime,
            focus,
            messages: {
              createMany: {
                data: [
                  {
                    sender: 'user',
                     content: prompt
                  },
                  {
                    sender: 'assistant',
                    content: startConvoResp
                  },
                ]
              }
            }
          }
        })

        return startConvoResp;

       }

       // starting a new quest daily session for focus
      // create a therapy session
      const prompt = startTherapyPrompt(focus);
      const startConvoResp = (await chatCompletionAi([
        { role: "user", content: prompt.trim() },
      ]))?.toString();
    ``
      if (!startConvoResp){
        throw new Error('oops something went wrong')
        return;
      }

      const msgs =  [
        {
          sender: 'user',
          isRoot: true,
          content: prompt
      },
      {
        sender: 'assistant',
        content: startConvoResp,
        isRoot: false
      }
      ]

      await prisma.dailyTherapySession.create({
          data: {
              questId: quest.id,
              start: startTime,
              end: endTime,
              isActive: true,
              focus,
              messages: {
                  createMany: {
                    data: msgs
                  }
              }
          }
      })
      return startConvoResp
    }),
    messages: protectedProcedure.input(z.object({
      questId: z.string(),
    })).query(async ({ ctx, input }) => {
        const prisma = ctx.prisma;


        const session = await prisma.dailyTherapySession.findFirst({
          where: {
            isActive: true,
            questId: input?.questId,
            
          },
          include: {
            messages: {
              where: {
                isRoot: false
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          }
        })
        console.log({ session })
        return session;
    }),
    sendMessage: protectedProcedure.input(z.object({
       sessionId: z.string(),
       msg: z.string()
    })).mutation(async ({ ctx, input }) => {
      const { msg, sessionId } = input;
      const prisma = ctx.prisma;

      const session = await prisma.dailyTherapySession.findFirst({
         where: {
          id: sessionId,
          isActive: true,
         },
         include: {
          messages: true
         }
      })
      if (!session){
        throw new Error('Invalid Therapy Session')
      }
      // check if session.start time is more than 5 mins from now then throw error 
      const startTime = new Date(session.start);
      const currentTime = new Date();
  
      const timeDifference = Math.abs(startTime.getTime() - currentTime.getTime());
      const minutesDifference = Math.ceil(timeDifference / (1000 * 60));
  
      if (minutesDifference >= 10) {
        throw new Error('Session expired');
      }


      const messages = session.messages.map((msg) => ({ role: msg.sender, content: msg.content }))
        
        messages.push({ role: 'user', content: msg })

      //create a message
      const convoResp = await chatCompletionAi(messages);

       if (!convoResp){
        throw new Error('Oops try again')
       }

       await prisma.message.createMany({
        data: [
          {
            sender: 'user',
            sessionId,
            content: msg
          },
          {
            sender: 'assistant',
            sessionId,
            content: convoResp 
          }
        ]
      })
      return convoResp
    })
});

export async function createChat (prisma: PrismaClient, focus: string, userId: string, questId: string) {

  const today = new Date();
  const startTime = today;
  const endTime = addMinutes(startTime, 6);
  

  // get quest for the user
  const quest = await prisma.quest.findFirst({
    where: { userId, isActive: true,  id: questId },
  });

  if (!quest){
     throw new Error('Quest not found')
  }

      // check if user already have an active sessaion
      const existingSession = await prisma.dailyTherapySession?.findMany({
        where: {
          questId: quest.id,
          focus,
        },
        include: {
          messages: true
        }
      });

     // starting an exiting quest daily session for focus
     if (existingSession.length){
      const conversation = existingSession.map((session) => {
        const messages = session.messages.map((msg) => ({ role: msg.sender, content: msg.content }))
        return messages;
      }).flat()
  
      const prompt =  'Can we continue the session?' // add prompt
      const messages = [...conversation, { role: 'user', content: prompt }]
      
      const startConvoResp = await chatCompletionAi(messages);

      if (!startConvoResp){
        throw new Error('oops something went wrong')
        return;
      }
      // create a new session with is root false
     const daily =  await prisma.dailyTherapySession.create({
        data: {
          questId: quest.id,
          start: startTime,
          isActive: true,
          end: endTime,
          focus,
          messages: {
            createMany: {
              data: [
                {
                  sender: 'user',
                   content: prompt
                },
                {
                  sender: 'assistant',
                  content: startConvoResp
                },
              ]
            }
          }
        }
      })

      console.log({ daily })

      return startConvoResp;
    
   }

   // starting a new session
   const prompt = startTherapyPrompt(focus);
   const startConvoResp = (await chatCompletionAi([
     { role: "user", content: prompt.trim() },
   ]))?.toString();

   if (!startConvoResp){
     throw new Error('oops something went wrong')
     return;
   }


   const msgs =  [
    {
      sender: 'user',
      isRoot: true,
      content: prompt
    },
    {
      sender: 'assistant',
      content: startConvoResp,
      isRoot: false
    }
  ]

  await prisma.dailyTherapySession.create({
    data: {
        questId: quest.id,
        start: startTime,
        end: endTime,
        isActive: true,
        focus,
        messages: {
            createMany: {
              data: msgs
            }
        }
    }
})
return startConvoResp

}