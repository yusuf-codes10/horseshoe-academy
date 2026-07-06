<script setup lang="ts">
import SideBar from '@/layouts/SideBar.vue';
import TopBar from '@/layouts/TopBar.vue';
import { useSideStore } from '@/stores/sideStore';

const sideStore = useSideStore();

// handle the emit
</script>

<template>
  <div class="flex h-[calc(100vh-72px)]">
    <SideBar @toggle="sideStore.toggle"/>
    <div class="w-full">
      <TopBar />
      <RouterView />
    </div>
  </div>
</template>
