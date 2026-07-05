<script setup lang="ts">
import NavBar from '@/layouts/NavBar.vue';
import { useUserStore } from './stores/userStore';

const userStore = useUserStore()
</script>

<template>
  <NavBar v-if="!userStore.isLoggedIn"/>
  <RouterView />
</template>

<style scoped></style>
