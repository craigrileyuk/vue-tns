<template>
    <header class="bg-teal-600 text-white py-2">
        <div class="container flex justify-between">
            <div>Vue TNS</div>
            <div>Other</div>
        </div>
    </header>
    <main>
        <div class="container py-4">
            <VueTns
                ref="tnsRef"
                pause-on-hover
                :responsive="{
                    xl: {
                        items: 2,
                        slideBy: 1,
                    },
                }"
            >
                <div v-for="img in images" class="overflow-hidden">
                    <img :src="img" class="object-cover h-full" />
                </div>
            </VueTns>
        </div>
    </main>
</template>

<script setup>
import { ref } from "vue";
import { VueTns } from "vue-tns";

import Image01 from "./images/01.jpg";
import Image02 from "./images/02.jpg";
import Image03 from "./images/03.jpg";

const tnsRef = ref(null);
const onClick = () => {
    console.log(tnsRef.value.getInfo());
};

const images = [Image01, Image02, Image03];
</script>
