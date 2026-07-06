<script setup lang="ts">
import { useRoute } from 'vue-router';
import {  Home } from "lucide-vue-next"
import { computed } from 'vue';


const route = useRoute();
const segments = computed(() => route.path.split('/').filter(Boolean))
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
    <p>
      >
    </p>
    <p>{{ segments[1] }}</p>
  </div>
</template>
