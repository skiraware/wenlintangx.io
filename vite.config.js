import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Base is '/' because you are using a custom domain (wenlintang.org) via CNAME
  base: "/",
});
