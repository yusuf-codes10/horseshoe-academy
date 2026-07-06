<script setup lang="ts">
import { useRoute } from 'vue-router';
import {  Home } from "lucide-vue-next"
import { computed } from 'vue';


const route = useRoute();
const segments = computed(() => route.path.split('/').filter(Boolean))
console.log('segments length is: ', segments.value.length);

</script>

<template>
  <div class="flex gap-2 w-full p-2">
    <RouterLink :to="{name: 'Dashboard'}">
      <Home :size="18"/>
    </RouterLink>
    <div v-for="(seg, index) in segments" :key="index">
      <p class="inline">> </p>
      <p class="cursor-pointer inline">
        {{ seg }}
      </p>
    </div>
  </div>
</template>
