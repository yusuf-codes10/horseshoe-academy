<script setup lang="ts">
import { useRoute } from 'vue-router';
import {  Home } from "lucide-vue-next"
import { computed } from 'vue';


const route = useRoute();

const segments = computed(() =>
  route.path
    .split('/')
    .filter(Boolean)
    .map((seg, index, arr) => ({
      label: seg,
      path: '/' + arr.slice(0, index + 1).join('/')
    }))
)
</script>

<template>
  <div class="flex gap-2 w-full p-2">
    <RouterLink :to="{name: 'Dashboard'}">
      <Home :size="18"/>
    </RouterLink>
    <div v-for="(seg, index) in segments" :key="index">
      <p class="inline">> </p>
      <RouterLink :to="{path: seg.path}">
        <p class="cursor-pointer inline">
          {{ seg.label }}
        </p>
      </RouterLink>
    </div>
  </div>
</template>
