<script setup lang="ts">
import NavigatorBar from "@/components/NavigatorBar.vue";
import SideBar from "@/layouts/SideBar.vue";
import TopBar from "@/layouts/TopBar.vue";
import { useSideStore } from "@/stores/sideStore";

const sideStore = useSideStore();

// handle the emit
</script>

<template>
  <div class="flex h-[calc(100vh-72px)]">
    <SideBar @toggle="sideStore.toggle"/>
    <div class="flex flex-col w-full min-h-0">
      <TopBar />
      <NavigatorBar />
      <div class="flex-1 overflow-y-auto min-h-0">
        <RouterView />
      </div>
    </div>
  </div>
</template>
