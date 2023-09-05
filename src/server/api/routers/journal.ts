import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getSentimentAnalysis } from "@/utils/openai";

export const journalRouter = createTRPCRouter({
  createOrUpdateJournal: protectedProcedure
    .input(
      z
        .object({
          theraputicalJournal: z
            .array(
              z.object({
                question: z.string(),
                answer: z.string(),
              })
            )
            .optional(),
          userMood: z.number().min(0).max(10).optional(),
          note: z.string().optional(),
          id: z.string().optional(),
        })
        .refine(
          (data) => {
            // Either `note` or `theraputicalJournal` should be present
            return (
              data.note !== undefined ||
              (data.theraputicalJournal !== undefined &&
                data.theraputicalJournal.length > 0)
            );
          },
          {
            message: 'Either "note" or "theraputicalJournal" must be provided',
          }
        )
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const userId = session.user.id;
      const { theraputicalJournal, userMood, note, id } = input;
      if (note) {
        // if note already exist update
        if (id) {
          const exist = await prisma.journal.findUnique({
            where: { id_userId: { id, userId } },
          });
          if (exist) {
            const journal = await prisma.journal.update({
              where: {
                id,
              },
              data: {
                note,
              },
            });
            return journal;
          }
        }

        // create note
        const journal = await prisma.journal.create({
          data: {
            note,
            userMood: 0,
            mood: 0,
            canEdit: true,
            userId,
          },
        });
        return journal;
      }

      if (theraputicalJournal?.length && userMood) {
        // should do sentiment to find user mood  first before we save to db
        const mood = await calculateMood(userMood, theraputicalJournal)
        const journal = await prisma.journal.create({
          data: {
            userMood: (userMood / 10),
            mood: parseFloat(mood.toFixed(2)),
            userId,
            therapy: {
              createMany: {
                data: theraputicalJournal.map((journal) => ({
                  question: journal.question,
                  answer: journal.answer,
                })),
              },
            },
          },
        });

        // // create metrics
        await prisma.activity.create({
          data: {
            userId,
            moodScore: parseFloat(mood.toFixed(2)),
            type: "THERAPY",
            endTime: new Date(),
          },
        });

        return journal;
      }
    }),

  getJournal: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const { prisma } = ctx;
      const userId = ctx.session.user.id;

      // return daily by user id
      const journal = await prisma.journal.findFirst({
        where: {
          userId,
          id,
          isDeleted: false,
        },
        include: {
          therapy: true,
        },
      });
      return journal;
    }),
  listPaginated: protectedProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { skip = 0, take = 10 } = input;

      const dailyList = await prisma.journal.findMany({
        where: {
          userId: session?.user.id,
          isDeleted: false,
        },
        include: {
          therapy: true,
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      });

      return dailyList;
    }),
  deleteJournal: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id } = input;

      const deleted = await ctx.prisma.journal.delete({
        where: {
          id_userId: {
            id,
            userId,
          },
        },
      });

      return deleted;
    }),
  // createOrSaveNote: protectedProcedure
  //   .input(
  //     z.object({
  //       note: z.string(),
  //       id: z.string().optional(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const id = input.id;

  //     if (id) {
  //       const journal = await ctx.prisma.journal.findUnique({
  //         where: {
  //           id_userId: {
  //             id,
  //             userId: ctx.session.user.id,
  //           },
  //         },
  //       });
  //       if (!daily) {
  //         // throw http error
  //         return;
  //       }

  //       // update not by id
  //       //    const currDaily = await ctx.prisma.daily.update({
  //       //     where: {
  //       //       id,
  //       //     },
  //       //     include: {
  //       //       user: true,
  //       //       journals: true,
  //       //     },
  //       //     data: {
  //       //       journals: {
  //       //         update: {
  //       //           note: input.note,

  //       //         }
  //       //       }
  //       //     }
  //       //  })
  //       // return currDaily;
  //     }
  //     // create new daily;
  //     const newDaily = await ctx.prisma.daily.create({
  //       data: {
  //         userId: ctx.session.user.id,
  //         userMood: 0,
  //         mood: 0,
  //         journal: {
  //           create: {
  //             note: input.note,
  //             moodScore: 0,
  //             canEdit: true,
  //           },
  //         },
  //       },
  //     });
  //     return newDaily;
  //   }),
});

const calculateMood = async (userMood: number, theraputicalJournal: {question: string, answer: string}[]): Promise<number> => {
  const sentimentAnalysisMood = await getSentimentAnalysis(theraputicalJournal);
  const currUserMood = userMood / 10;
  const correlation = Math.abs(currUserMood - sentimentAnalysisMood);
  let mood = currUserMood;

  // Adjust the final mood based on the correlation
  if (correlation >= 0.1) {
    if (currUserMood > sentimentAnalysisMood) {
      mood -= correlation;
    } else {
      mood += correlation;
    }
  }

  return parseFloat(mood.toFixed(2));
};
