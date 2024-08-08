import { defineConfig } from "vite";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/main.js"),
            name: "VueTns",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["vue", "vue3-mq"],
        },
    },
    plugins: [vue()],
});
