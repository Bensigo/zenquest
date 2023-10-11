import { PrismaClient } from "@prisma/client";
import { mailWithSendgrid } from "../api/utils/sendgrid";


 // send weekly notification with inspirational quote on starting follow up with there goal
 export async function  sendWeeklyGoalReminder() {
    try {
        const prisma = new PrismaClient();

        // get all active goal users;
        const quests = await prisma.quest.findMany({
            where: {
                isActive: true
            },
            select: {
                user: true
            }
        });

        if (!quests){
            await prisma.$disconnect()
            return;
        }
        const userEmails = new Set(quests.map((quest) => quest.user.email));
        const batchSize = 50;
        let totalSent = 0;
        // send email in batches of 50;
        while (totalSent < userEmails.size){
            // send email and increament total sent
            const emails =  Array.from(userEmails).slice(totalSent, totalSent + batchSize) 
            const emailTemplateId = ''
            await mailWithSendgrid({
                to: emails as string[],
                from: {
                    name: 'No Reply',
                    email: 'noReply@zenQuest.ai'
                },
                subject: '',
                templateId: emailTemplateId,
                data: {
                    qoute: ``
                }
            })
            
            totalSent += batchSize;
        }
      



    }
    catch (err: unknown){
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`email notification job error: ${err}`)
    }
}