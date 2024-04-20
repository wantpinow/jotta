import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
    database: env.PG_DATABASE,
  },
  tablesFilter: ["jotta_*"],
} satisfies Config;
