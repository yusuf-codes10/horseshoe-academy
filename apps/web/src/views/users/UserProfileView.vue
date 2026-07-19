<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const userStore = useUserStore();
const route = useRoute();

const isMyProfile = computed(() => route.params.username === userStore.user.username);
</script>

<template>
  <div>

  </div>
</template>
