<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const userStore = useUserStore();
const route = useRoute();

// this computed property should be the one to know if we are fetching our own or viwing another ser profile
const isMyProfile = computed(() => route.params.username === userStore.user!.username);

console.log(isMyProfile);

</script>

<template>
  <div>

  </div>
</template>
