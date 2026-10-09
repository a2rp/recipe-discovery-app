import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/recipe-discovery-app/",
    build: { sourcemap: false },
    plugins: [react()],
});