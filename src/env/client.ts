import { createEnv } from '@t3-oss/env-nextjs';

export const clientEnv = createEnv({
  client: {},
  runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
