import { env } from "@/env.mjs";
import sendgrid from "@sendgrid/mail"


export type SendGridInput  = {
  to: string | string[];
  from: { name?: string; email: string };
  subject: string;
  templateId: string;
  data?: Record<string, any>
}

if (env && env.SENDGRID_API_KEY){
  sendgrid.setApiKey(env.SENDGRID_API_KEY);
}



export async function mailWithSendgrid (params: SendGridInput){
    try {
        if (process.env.VERCEL_ENV === 'prview' || process.env.VERCEL_ENV === 'development')return;
  
        await sendgrid.send({
          to: params.to,
          from: params.from,
          subject: params.subject,
          templateId: params.templateId
        });
    }catch (err: unknown){
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`error from send grid: ${err}`)
    }
}