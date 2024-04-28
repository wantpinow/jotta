import { env } from "~/env";
import { OpenAPI } from "~/lib/ml";
import { openApiTsSchema } from "~/lib/ml/zod.gen";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

OpenAPI.BASE = `https://${env.MODAL_USER}-${env.MODAL_ENVIRONMENT}--${env.MODAL_APP_PREFIX}-router-fastapi-app.modal.run`;
OpenAPI.interceptors.request.use((request) => {
  request.headers = {
    ...JSON.parse(JSON.stringify(request.headers)), // for some reason can't use request.headers directly
    Authorization: `Bearer ${env.MODAL_ROUTER_AUTH_TOKEN}`,
  };
  return request;
});

export const mlRouter = createTRPCRouter({
  ping: protectedProcedure.query(async ({ ctx }) => {
    const response = await ctx.modal.pingGet();
    return response;
  }),
  process: protectedProcedure
    .input(openApiTsSchema.shape["/process"].shape.post.shape.req)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.modal.processProcessPost(input);
      return response.data;
    }),
});
