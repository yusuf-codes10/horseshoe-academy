<script setup lang="ts">
import SecondaryButton from '@/components/shared/SecondaryButton.vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const logout = async () => {
  await userStore.logout();
  router.push('/');
}
</script>

<template>
  <div class="flex justify-end items-center w-full border-b border-bg-border">
    <SecondaryButton title="logout" class="mb-3" @click="logout"/>
    <p>Welcome {{ userStore.user?.username }}</p>
  </div>
</template>
