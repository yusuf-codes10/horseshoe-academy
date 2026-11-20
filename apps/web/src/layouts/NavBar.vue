<script setup lang="ts">
import MainButton from "@/components/shared/MainButton.vue";
import SecondaryButton from "@/components/shared/SecondaryButton.vue";
// import SecondaryButton from '@/components/shared/SecondaryButton.vue';
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { SunMoon } from "lucide-vue-next";
import { useThemeStore } from "@/stores/themeStore";

const themeStore = useThemeStore();
const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  await userStore.fetchUser();
  if (!userStore.user) {
    console.log("no logged in user!");
  }
  console.log(userStore.user);
});

// logout function
const logout = async () => {
  console.log("logging out....");
  await userStore.logout();
  router.push("/");
};
</script>

<template>
  <nav class="flex justify-between items-center px-4 py-2 sticky w-full">
    <h1>ClassRoom</h1>
    <!-- <MainButton v-if="!userStroe.user" title="Log in" /> -->
    <div class="flex justify-between items-center">
      <!-- <SecondaryButton :isGhost="false" :loading="false" title="Sign In"/> -->
      <div>
        <SunMoon @click="themeStore.toggleTheme" class="cursor-pointer" :size="20" />
      </div>
      <div v-if="userStore.isLoggedIn">
        <SecondaryButton @click="logout" title="Log out" />
        Welcome {{ userStore.user?.username }}
      </div>
      <RouterLink v-else :to="{ name: 'Register' }">
        <MainButton title="Sign Up" />
      </RouterLink>
    </div>
  </nav>
</template>
