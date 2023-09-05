import { subHours, subMonths, subWeeks, subYears } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { type  PrismaClient } from "@prisma/client";


export enum MoodMetricIntervals {
    week= 'week',
    month = 'month',
    year = 'year'
}

export enum ActivitiesMetricIntervals {
    day =  'day',
    week= 'week',
    month = 'month',
    year = 'year'
}
export const metricRouter = createTRPCRouter({
    getUserMetrics: protectedProcedure
    .input(z.object({ 
        interval: z.nativeEnum(ActivitiesMetricIntervals),
    })).query( async ({ ctx, input }) => {

        const  { session, prisma } = ctx;
        const today = new Date()
        const { interval } = input;
        const user = session.user;
        
        // we get the user mood metrics base on the interval
        let aggregatedData;
        let avgMoodScore;

     switch(interval){
        case ActivitiesMetricIntervals.day:
            const lastDay = subHours(today, 24)
            aggregatedData =await  getMetrics(prisma, lastDay, user.id);
            break;
        case ActivitiesMetricIntervals.week:
            const lastWeek = subWeeks(today, 1);
            aggregatedData =await getMetrics(prisma, lastWeek, user.id);
          
            break;
        case ActivitiesMetricIntervals.month:
            const lastMonth = subMonths(today, 1);
            aggregatedData =await getMetrics(prisma, lastMonth, user.id)
        
            break
        case ActivitiesMetricIntervals.year:
            const lastYear = subYears(today, 1);
            aggregatedData = await getMetrics(prisma, lastYear, user.id)
         
            break;
        default:
            const day = subHours(today, 24)
            aggregatedData = await getMetrics(prisma, day, user.id);
           
            break;
     }

        return {aggregatedData };
    }),
    getAverageMoodMetrics: protectedProcedure.input(z.object({
        interval: z.nativeEnum(ActivitiesMetricIntervals)
    })).query( async ({ ctx, input }) => {
        const  { session, prisma } = ctx;
        const today = new Date()
        const { interval } = input;
        const user = session.user;
        let avgMoodScore;
        switch(interval){
            case ActivitiesMetricIntervals.day:
                const lastDay = subHours(today, 24)
                avgMoodScore =await getAverageMoodMetrics(prisma, lastDay, user.id)
                break;
            case ActivitiesMetricIntervals.week:
                const lastWeek = subWeeks(today, 1);
                avgMoodScore =await getAverageMoodMetrics(prisma, lastWeek, user.id)
                break;
            case ActivitiesMetricIntervals.month:
                const lastMonth = subMonths(today, 1);
     
                avgMoodScore = await getAverageMoodMetrics(prisma, lastMonth, user.id)
                break
            case ActivitiesMetricIntervals.year:
                const lastYear = subYears(today, 1);
        
                avgMoodScore =await getAverageMoodMetrics(prisma, lastYear, user.id)
                break;
            default:
                const day = subHours(today, 24)
                avgMoodScore = await getAverageMoodMetrics(prisma, day, user.id)
                break;
         }
         return { avgMoodScore }
         
    }),
    createMoodMetric: protectedProcedure.input(z.object({
        mood: z.string(),
        score: z.number()
    })).mutation(async ({ctx, input}) => {
        const prisma = ctx.prisma;

       const mood = await prisma.mood.create({
            data: {
                userId: ctx.session.user.id,
                score: input.score,
                mood: input.mood
            }
        })
        return mood;
    }),
    getUserMoodMetrics: protectedProcedure.input(z.object({
        interval: z.nativeEnum(ActivitiesMetricIntervals)
    })).query( async ({ ctx, input }) => {
        const  { session, prisma } = ctx;
        const today = new Date()
        const { interval } = input;
        const user = session.user;
        let avgMoodScore;

        switch(interval){
            case ActivitiesMetricIntervals.day:
                const lastDay = subHours(today, 24)
                avgMoodScore =await averageMood(prisma, lastDay, user.id)
                break;
            case ActivitiesMetricIntervals.week:
                const lastWeek = subWeeks(today, 1);
                avgMoodScore =await averageMood(prisma, lastWeek, user.id)
                break;
            case ActivitiesMetricIntervals.month:
                const lastMonth = subMonths(today, 1);
     
                avgMoodScore = await averageMood(prisma, lastMonth, user.id)
                break
            case ActivitiesMetricIntervals.year:
                const lastYear = subYears(today, 1);
        
                avgMoodScore =await averageMood(prisma, lastYear, user.id)
                break;
            default:
                const day = subHours(today, 24)
                avgMoodScore = await averageMood(prisma, day, user.id)
                break;
         }
         return { avgMoodScore }  
    })
})

// 

function getMetrics(client: PrismaClient, interval: Date, userId: string){
    return  client.journal.groupBy({
        by: ['createdAt'],
        _avg: {
            mood: true,
        },
        where: {
            userId,

            createdAt: {
                gte: interval
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

async function getAverageMoodMetrics(client: PrismaClient, interval: Date, userId: string){
    const resp =  await client.journal.aggregate({
        _avg: {
            mood: true,
        },
        where: {
            userId,
            canEdit: false,
            isDeleted: false,
            createdAt: {
                gte: interval
            }
        }
    }) 
    return resp._avg;
}

async function averageMood(client: PrismaClient, interval: Date, userId: string){
    const resp = await client.mood.aggregate({
        _avg: {
            score: true
        },
        where: {
            userId,
            createdAt: {
                gte: interval
            }
        }
    })
    return resp._avg
}