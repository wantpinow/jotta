import { fileURLToPath } from "node:url";
import {createJiti} from "jiti";

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
const jiti = createJiti(fileURLToPath(import.meta.url));
jiti.import("./src/env/server");
jiti.import("./src/env/client");
 
/** @type {import('next').NextConfig} */
export default {
  /** ... */
};