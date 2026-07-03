<script setup lang="ts">
import MainButton from "@/components/shared/MainButton.vue";
// import SecondaryButton from '@/components/shared/SecondaryButton.vue';
import { useUserStore } from "@/stores/userStore";
import { onMounted } from "vue";

const userStore = useUserStore();

onMounted(async() => {
  await userStore.fetchUser();
  if (!userStore.user) {
    console.log('no logged in user!');
  }
  console.log(userStore.user);
})
</script>

<template>
  <nav class="flex justify-between items-center px-4 py-2 sticky w-full">
    <h1>ClassRoom</h1>
    <!-- <MainButton v-if="!userStroe.user" title="Log in" /> -->
    <div class="flex justify-between items-center">
      <!-- <SecondaryButton :isGhost="false" :loading="false" title="Sign In"/> -->
       <div v-if="userStore.isLoggedIn">
        Welcome {{ userStore.user?.username }}
       </div>
      <RouterLink v-else :to="{ name: 'Register' }">
        <MainButton title="Sign Up" />
      </RouterLink>
    </div>
  </nav>
</template>
