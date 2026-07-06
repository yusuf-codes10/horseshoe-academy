<script setup lang="ts">
import { useRoute } from 'vue-router';
import {  Home } from "lucide-vue-next"


const route = useRoute();
const segments = route.path.split('/').filter(Boolean)

</script>

<template>
  <div class="flex gap-2 w-full p-2">
    <RouterLink :to="{name: 'Dashboard'}">
      <Home :size="18"/>
    </RouterLink>
    <p>> </p>
    <p class="cursor-pointer">

      {{ segments[0] }}
    </p>
  </div>
</template>
