import { env } from "~/env";
import { OpenAPI } from "~/lib/ml";
import { openApiTsSchema } from "~/lib/ml/zod.gen";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

OpenAPI.BASE = `https://${env.MODAL_USER}-${env.MODAL_ENVIRONMENT}--${env.MODAL_APP_PREFIX}-router-fastapi-app.modal.run`;
OpenAPI.interceptors.request.use((request) => {
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${env.MODAL_ROUTER_AUTH_TOKEN}`,
  };
  return request;
});

export const mlRouter = createTRPCRouter({
  process: protectedProcedure
    .input(openApiTsSchema.shape["/process"].shape.get.shape.req)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.modal.processProcessGet(input);
      return response.data;
    }),
});
