import { ValidateEnv } from "@julr/vite-plugin-validate-env";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { z } from "zod/v4";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: "eslint ./src",
        dev: {
          logLevel: ["error"],
        },
      },
    }),
    ValidateEnv({
      validator: "standard",
      schema: {
        REACT_CARE_API_URL: z.url(),
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4001,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  envPrefix: "REACT_",
});
