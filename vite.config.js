import dotenvExpand from 'dotenv-expand';
import { loadEnv, defineConfig } from 'vite';


export default defineConfig(({ mode }) => {
  return {
    define: {
      __APP_ENV__: process.env.VITE_VERCEL_ENV,
      target: 'esnext' //browsers can handle the latest ES features
    },
  };
});
