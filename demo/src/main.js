import { createApp } from "vue";
import { Vue3Mq } from "vue3-mq";
import App from "./App.vue";
import "./index.postcss";

const app = createApp(App).use(Vue3Mq, {
    preset: "tailwind",
});

app.mount("#app");
