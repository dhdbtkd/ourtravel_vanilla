import dotenvExpand from 'dotenv-expand';
import { loadEnv, defineConfig } from 'vite';


export default defineConfig(({ mode }) => {
  // This check is important!
  // if (mode === "development") {
  //   const env = loadEnv(mode, process.cwd(), "");
  //   dotenvExpand.expand({ parsed: env });
  // }

  return {
    define: {
      __APP_ENV__: process.env.VITE_VERCEL_ENV,
    },
  };
});
