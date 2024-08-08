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
        <div v-for="img in imagePaths" class="overflow-hidden">
          <img :src="img" class="object-cover h-full" />
        </div>
      </VueTns>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { VueTns } from "vue-tns";

const images = import.meta.glob("./images/*.jpg", { eager: true });
const imagePaths = computed(() =>
  Object.values(images).map((img) => img?.default ?? img)
);

const tnsRef = ref(null);
const onClick = () => {
  console.log(tnsRef.value.getInfo());
};

// const images = [Image01, Image02, Image03];
</script>
