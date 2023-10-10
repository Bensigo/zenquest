/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type DailyTherapySession, PrismaClient } from "@prisma/client";
import { type NextApiResponse, type NextApiRequest } from "next";
import { Configuration, OpenAIApi } from "openai";
import { env } from "@/env.mjs";
import { authOptions, getServerAuthSession } from "@/server/auth";
import { type IncomingMessage } from "http";



const config = new Configuration({
  apiKey: env.OPEN_AI,
});
const openai = new OpenAIApi(config)

let content = ''

export default async function POST(req: NextApiRequest, res: NextApiResponse) {

  // handle auth
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const session =  await getServerAuthSession({ req, res,  authOptions  });
  if(!session){
    return res.status(401).send("Unauthorized")
  }
  

  const prisma = new PrismaClient();
  
  const { sessionId, messages } =   JSON.parse(req.body as string) as { messages: any[], sessionId: string }; 

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
    return res.status(400).send("Invalid Therapy Session")
   
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
    temperature: 0.6,
  }, { responseType: 'stream'});


  const stream = response.data as unknown as IncomingMessage;

  stream.on('data', (chunk: Buffer) => processChunk(chunk, res));
  
  stream.on('error', (err: Error) => {
    console.log(err);
    res.status(500).send("Internal Server Error");
  });

  stream.on('end', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const msg = messages[messages.length - 1].content
    const saveMessagesToDatabase = async () =>   await prisma.message.createMany({
          data: [
            {
              sender: "user",
              sessionId,
              content: msg,
            },
            {
              sender: "assistant",
              sessionId,
              content,
            },
          ],
    });
    void saveMessagesToDatabase();
    return;
  })
  
  return res.status(200);
}

function processChunk(chunk: Buffer, res: NextApiResponse) {
  const payloads = chunk.toString().split("\n\n");
  for (const payload of payloads) {
    if (payload.includes('[DONE]')) return;
    if (payload.startsWith("data:")) {
      const data = JSON.parse(payload.replace("data: ", ""));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const chunkContent: string | undefined = data.choices[0].delta?.content;
      if (chunkContent) {
        content += chunkContent;
        res.write(chunkContent);
      }
    }
  }
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