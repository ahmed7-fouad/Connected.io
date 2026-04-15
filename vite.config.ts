import { defineConfig } from 'vite'
import { resolve } from "path";
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: "/Connected.io/",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname,"index.html"),
        page: resolve(__dirname,"postPage.html"),
        profile: resolve(__dirname,"profile.html"),
      },
    },
  },
});