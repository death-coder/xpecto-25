import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const workshopRouter = createTRPCRouter({
  createWorkshop: publicProcedure
    .input(
      z.object({
        begin_time: z.date(),
        description: z.string(),
        venue: z.string(),
        end_time: z.null(),
        name: z.string(),
        regPlans: z
          .object({
            name: z.string(),
            description: z.string(),
            price: z.string(),
            labelling: z.string(),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const eventDetails = await ctx.db.eventDetails.create({
        data: {
          begin_time: new Date(input.begin_time),
          end_time: new Date(),
          name: input.name,
          description: input.description,
          venue: input.venue,
          slug: input.name.toLowerCase().replace(/ /g, "-"),
          cover: "",
          regPlans: {
            createMany: {
              data: input.regPlans.map((regPlan) => ({
                name: regPlan.name,
                description: regPlan.description,
                price: parseInt(regPlan.price),
                labelling: regPlan.labelling,
              })),
            },
          },
        },
      });
      return ctx.db.workshops.create({
        data: {
          workshopDetailsId: eventDetails.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }),

  getWorkshop: publicProcedure.query(async ({ ctx }) => {
    const workshop = await ctx.db.workshops.findMany({
      include: {
        workshopDetails: {
          include: { regPlans: true },
        },
      },
    });
    return workshop;
  }),

  getWorkshopBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const workshop = await ctx.db.workshops.findFirst({
        where: {
          workshopDetails: {
            slug: input.slug,
          },
        },
        include: {
          workshopDetails: {
            include: { regPlans: true },
          },
        },
      });
      return workshop ?? null;
    }),

    getPastWorkshops: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      const pastWorkshops = await ctx.db.workshops.findMany({
        where: {
          workshopDetails: {
            end_time: {
              lte: new Date(input.date),
            },
          },
        },
        include: {
          workshopDetails: {
            include: { regPlans: true },
          },
        },
        orderBy: {
          workshopDetails: {
            end_time: "desc",
          },
        },
      });
      return pastWorkshops;
    }),

  getUpcomingWorkshops: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      const upcomingWorkshops = await ctx.db.workshops.findMany({
        where: {
          workshopDetails: {
            begin_time: {
              gt: new Date(input.date),
            },
          },
        },
        include: {
          workshopDetails: {
            include: { regPlans: true },
          },
        },
        orderBy: {
          workshopDetails: {
            begin_time: "asc",
          },
        },
      });
      return upcomingWorkshops;
    }),

  getOngoingWorkshops: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      const ongoingWorkshops = await ctx.db.workshops.findMany({
        where: {
          workshopDetails: {
            begin_time: {
              lte: new Date(input.date),
            },
            end_time: {
              gte: new Date(input.date),
            },
          },
        },
        include: {
          workshopDetails: {
            include: { regPlans: true },
          },
        },
        orderBy: {
          workshopDetails: {
            begin_time: "desc",
          },
        },
      });
      return ongoingWorkshops;
    }),
});
