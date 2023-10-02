import { type NextApiRequest,type  NextApiResponse } from "next";
import { CronManager } from "@/server/crons";



export const dynamic = 'force-dynamic'


export default  async function  GET(req: NextApiRequest, res: NextApiResponse){
 const cronName = req.query.name as string;
if (!cronName){  
  return res.status(400).send('Invalid cron');
}
await CronManager(cronName);
return res.status(200).json({ isCompled: true })
} 