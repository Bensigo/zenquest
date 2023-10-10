import { expiredQuestToInActive } from "./expiredQuestToInActive.cron";



const jobs = Object.freeze({
  expiredQuestToInActive: expiredQuestToInActive,
});

export async function CronManager(name: string) {
  const job = jobs[name as keyof typeof jobs];
  return job();
}






