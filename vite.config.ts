import { defineConfig } from 'vite'
import { resolve } from "path";
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        page: resolve("postPage.html"),
        clientProfile: resolve("clientProfile.html"),
        base: "Connected.io",
      },
    },
  },
});