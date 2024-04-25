import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { iconNames } from "~/server/db/icons";
import { decks, cards } from "~/server/db/schema";

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
        with: { cards: true },
        where: and(eq(decks.id, input.id), eq(decks.userId, ctx.auth.userId)),
      });
    }),
  createDeck: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        icon: z.enum(iconNames),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db
        .insert(decks)
        .values({
          userId: ctx.auth.userId,
          name: input.name,
          description: input.description,
          icon: input.icon,
        })
        .returning()
        .execute();
    }),
  createCard: protectedProcedure
    .input(
      z.object({
        deckId: z.string().uuid(),
        front: z.string(),
        back: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db
        .insert(cards)
        .values({
          deckId: input.deckId,
          front: input.front,
          back: input.back,
        })
        .returning()
        .execute();
    }),
});
