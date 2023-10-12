/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type DailyTherapySession, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { env } from "@/env.mjs";



export const runtime = 'edge';

const config = new Configuration({
  apiKey: env.OPEN_AI,
})

const openai = new OpenAIApi(config)

export default async function POST(req: Request) {

  // handle auth
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    // const session = req.headers.getSetCookie()
  
    // console.log({ session  })
    // if (!session){
    //   return new Response('Unauthorized', {
    //     status: 401
    //   })
    // }
  

  const prisma = new PrismaClient().$extends(withAccelerate());
  const json = await req.json() as { messages: any[], sessionId: string }
  
  const { sessionId, messages } =   json;



  const dailySession = await prisma.dailyTherapySession.findFirst({
    where: {
      isActive: true,
      id: sessionId
    },
    include: {
      messages: true,
    },
  });

  if (!dailySession) {
    return Response.json("Invalid Therapy Session")
   
  }
  
  

  // const isValidChatSession = isValidSession(dailySession)
  // if (!isValidChatSession){
  //    res.status(400).send("Expired session")
  //    return;
  // }

  const response = await openai.createChatCompletion({
    stream: true,
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.4,
  });


  const stream = OpenAIStream(response, {
    async onCompletion(content){
      await prisma.message.createMany({
        data: [
          {
            sender: "user",
            sessionId,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            content: messages[messages.length - 1].content,
          },
          {
            sender: "assistant",
            sessionId,
            content,
          },
        ],
  });
    }
  })

  return new StreamingTextResponse(stream)
}



function isValidSession(dailySession: DailyTherapySession) {
    const startTime = new Date(dailySession.start);
  const currentTime = new Date();
  
  const timeDifference = Math.abs(
    startTime.getTime() - currentTime.getTime()
  );
  const minutesDifference = Math.ceil(timeDifference / (1000 * 60));
  
  return minutesDifference < 30
}