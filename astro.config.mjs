import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://mikey.baby",
  integrations: [react()],
  experimental: {
    fonts: [
      {
        name: "Gaegu",
        cssVariable: "--font-gaegu",
        provider: fontProviders.google(),
      },
      {
        name: "Merriweather",
        cssVariable: "--font-merriweather",
        provider: fontProviders.google(),
      },
      {
        name: "Open Sans",
        cssVariable: "--font-open-sans",
        provider: fontProviders.google(),
        weights: ["400", "700"],
      },
      {
        name: "Pacifico",
        cssVariable: "--font-pacifico",
        provider: fontProviders.google(),
      }
    ]
  },
  vite: {
    plugins: [tailwindcss()]
  }
});