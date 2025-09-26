import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "offline.html"],
      manifest: {
        name: "xCHnG",
        short_name: "xCHnG",
        description: "POC App for Document Exchange",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
              networkTimeoutSeconds: 3,
            },
          },
        ],
        navigateFallback: "/offline.html",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    cors: {
      origin: "",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  },
});
