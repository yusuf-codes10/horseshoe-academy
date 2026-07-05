<script setup lang="ts">
import SideBar from '@/layouts/SideBar.vue';
import { useSideStore } from '@/stores/sideStore';

const sideStore = useSideStore();

// handle the emit
</script>

<template>
  <div>
    <SideBar @toggle="sideStore.toggle"/>
    <div>
      <h1 class="title">This is the main dashboard</h1>
      <RouterView />
    </div>
  </div>
</template>
