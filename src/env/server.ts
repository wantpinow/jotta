import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const serverEnv = createEnv({
  server: {
    // next
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    HOST: z.string(),
    // postgres
    DATABASE_NAME: z.string().min(1),
    DATABASE_USERNAME: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    DATABASE_PORT: z.string().min(1),
    DATABASE_URL: z.string().url(),
  },
  experimental__runtimeEnv: process.env
});