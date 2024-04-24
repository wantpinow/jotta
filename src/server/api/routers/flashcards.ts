import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { decks } from "~/server/db/schema";

export const flashcardsRouter = createTRPCRouter({
  getDecks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.decks.findMany({
      with: { cards: true },
      where: eq(decks.userId, ctx.auth.userId),
    });
  }),
  getDeck: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.query.decks.findFirst({
        where: and(eq(decks.id, input.id), eq(decks.userId, ctx.auth.userId)),
      });
    }),
});
