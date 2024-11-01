<script setup>
import { ref } from "vue";
const name = ref("Stef");
</script>

<template>
  <h1 class="text-center text-5xl mb-4">
    Hi I'm {{ name }}<br />
    It's super nice to meet you.<br />
    I created this website using Vue.
  </h1>
  <div
    class="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5"
  >
    <img class="logo" src="@/assets/logo.svg" alt="Vue logo" />
    <img class="logo" src="@/assets/logo.svg" alt="Vue logo" />
    <img class="logo" src="@/assets/logo.svg" alt="Vue logo" />
    <img class="logo" src="@/assets/logo.svg" alt="Vue logo" />
    <img class="logo" src="@/assets/logo.svg" alt="Vue logo" />
  </div>
</template>

<style scoped></style>
