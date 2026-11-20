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

const brand = { name: "Horseshoe", suffix: "Academy" };

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
    <h1>
      <RouterLink
        :to="{ name: 'Home' }"
        class="group inline-flex items-baseline gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <!-- Horseshoe mark, open end up. Swap for your own logo SVG later. -->
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          aria-hidden="true"
          class="self-center text-primary transition-transform duration-300 group-hover:-rotate-12 motion-reduce:transition-none"
        >
          <path
            d="M6 3.5V11a6 6 0 0 0 12 0V3.5"
            fill="none"
            stroke="currentColor"
            stroke-width="3.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <g class="fill-background">
            <circle cx="6" cy="6.5" r="0.75" />
            <circle cx="7.76" cy="15.24" r="0.75" />
            <circle cx="12" cy="17" r="0.75" />
            <circle cx="16.24" cy="15.24" r="0.75" />
            <circle cx="18" cy="6.5" r="0.75" />
          </g>
        </svg>
        <span class="text-xl leading-none text-text-primary font-[Rye,Georgia,serif]">
          {{ brand.name }}
        </span>
        <span class="text-sm text-text-muted">{{ brand.suffix }}</span>
      </RouterLink>
    </h1>
    <!-- <MainButton v-if="!userStroe.user" title="Log in" /> -->
    <div class="flex justify-between items-center gap-4">
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
