<script setup lang="ts">
import NavBar from '@/layouts/NavBar.vue';
import { useUserStore } from './stores/userStore';
import { useThemeStore } from './stores/themeStore';

const userStore = useUserStore();
useThemeStore();
</script>

<template>
  <NavBar v-if="!userStore.isLoggedIn"/>
  <RouterView />
</template>

<style scoped></style>
