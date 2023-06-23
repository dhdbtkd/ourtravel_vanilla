import dotenvExpand from 'dotenv-expand';
import { loadEnv, defineConfig } from 'vite';


export default defineConfig({
  server: {
    cors : {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    },
  }
});
