<script setup lang="ts">
import SecondaryButton from "@/components/shared/SecondaryButton.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { Bell } from "lucide-vue-next";

const userStore = useUserStore();
const router = useRouter();

const logout = async () => {
  await userStore.logout();
  router.push("/");
};

const navigateToMyProfile = () => {
  router.push(`/${userStore.user?.username}`);
};

const navigateToNotifications = () => {
  router.push({ name: "Notifications" });
};
</script>

<template>
  <div class="flex justify-end items-center w-full border-b border-bg-border">
    <div class="relative">
      <Bell @click="navigateToNotifications" :size="20" class="cursor-pointer" />

      <span
        class="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white"
      >
        {{ userStore.unreadCount }}
      </span>
    </div>
    <SecondaryButton title="logout" class="mb-3" @click="logout" />
    <div>
      <p class="cursor-pointer" @click="navigateToMyProfile">
        {{ userStore.user?.username }}
      </p>
    </div>
  </div>
</template>
