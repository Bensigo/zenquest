import { PrismaClient } from "@prisma/client";

// trigger job everyday at 3:00 am
export async function expiredQuestToInActive() {
    try {
      const prisma = new PrismaClient();
      const batchSize = 20; // Number of quests to update in each batch
      let totalUpdated = 0;
      const quests = await prisma.quest.findMany({
        where: {
          endDate: {
            lte: new Date(),
          },
          isActive: true
        },
      });
  
      if (quests.length === 0) {
        console.log("No quests to update.");
        await prisma.$disconnect();
        return;
      }
  
      console.log(`Total quests to update: ${quests.length}`);
  
      while (totalUpdated < quests.length) {
        const questToUpdate = quests.slice(
          totalUpdated,
          totalUpdated + batchSize
        );
        const idsToUpdate = questToUpdate.map((quest) => quest.id);
        await prisma.quest.updateMany({
          where: {
            id: {
              in: idsToUpdate,
            },
          },
          data: {
            isActive: false,
          },
        });
  
        totalUpdated += questToUpdate.length;
      }
      console.log(`Total quests updated: ${totalUpdated} of ${quests.length}`);
      await prisma.$disconnect();
    } catch (err) {
      console.log({ err });
    }
  }