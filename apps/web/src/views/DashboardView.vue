<script setup lang="ts">
import SideBar from '@/layouts/SideBar.vue';

</script>

<template>
  <div>
    <SideBar />
    <div>
      <h1 class="title">This is the main dashboard</h1>
      <RouterView />
    </div>
  </div>
</template>
