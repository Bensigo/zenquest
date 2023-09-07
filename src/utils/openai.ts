/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { env } from "@/env.mjs";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: env.OPEN_AI,
});

const ai = new OpenAIApi(config);

export function extractQuestionsFromString(text: string): string[] {
  const lines = text.split('\n');
  const questions: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    // find a better way because text can return without count in the future
    if (line && /^[1-5]\./.test(line)) {
      const questionLine = line.slice(line.indexOf('.') + 1);
      const question = questionLine.trim();

      questions.push(question);
    }
  }
  return questions;
}

// 'user' | 'system' |'assistant' only roles
export async function chatCompletionAi(msgs: {role: string, content: string }[], temperature = 0.2){
   try {
    const resp = await ai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: msgs as ChatCompletionRequestMessage[],
      temperature
    }, { timeout: 2000 })
    console.log({ resp })
    return resp.data.choices[0]?.message?.content;
   }catch (err: unknown){
      console.log(err);
   }
}             

export async function queryOpenAi(prompt: string, temperature = 0.7) {
  try {

    // note: sometimes you get network error due to overload
    const resp = await ai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: 'user', content: prompt }],
        temperature,
        // n: 1
      }
  
    );
    const data = resp.data.choices[0]?.message?.content;

    return data;
  } catch (err: unknown) {
   
    console.log({ err })
    
  }
}


const que = `You are playing the role of a therapist.
I will provide you with a question and answer,
and I need you to perform sentiment analysis on the user's mood based on their responses.
Your task is to evaluate the sentiment for the answer based on the corresponding question and return a sentiment analysis score ranging from 0 to 1
`


export async function getSentimentAnalysis(data: {question: string, answer: string }[]): Promise<number>{
  const resp =await Promise.all(data.map((item) => queryOpenAi(`${que} \n que: ${item.question} \n ans: ${item.answer}`,0)))
  const scores = resp.map((feedback) => {
    const sentiment = feedback?.split('\n')[0]
    const score = sentiment?.split(':')[1];
    return parseFloat(score || '');
  })
  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = total / scores.length;
  return average;
}

export function extractSentimentAnalysis(rawStr: string){
  const rawScores = rawStr.split('\n')[0] as string; 

  const scores = JSON.parse(rawScores) as number[];

  if (scores.length > 0){
   const averageMood =  (scores.reduce((curr, acc) => curr + acc)) / scores.length;
   return averageMood.toFixed(2);
  }
  return 0;
}


export function extractArrayFromString(text: string): string[] {
  

  const lines = text.split('\n');
  const list: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    // find a better way because text can return without count in the future
    if (line && /^[1-9]\./.test(line)) {
      const questionLine = line.slice(line.indexOf('.') + 1);
      const question = questionLine.trim();

      list.push(question);
    }
  }
  return list;
}
