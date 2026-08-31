<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useThemeStore } from "@/stores/themeStore";
import { useRouter } from "vue-router";
import { Bell, SunMoon } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import api from "@/services/api";

const userStore = useUserStore();
const themeStore = useThemeStore();
const router = useRouter();
const notificationsCount = ref(0);

const navigateToMyProfile = () => {
  router.push(`/${userStore.user?.username}`);
};

const navigateToNotifications = () => {
  router.push({ name: "Notifications" });
};

const getCount = async () => {
  try {
    const response = await api.get("/notifications/count");
    console.log("count is: ", response.data);
    return response.data.notificationCount;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  notificationsCount.value = await getCount();
});
</script>

<template>
  <div class="flex justify-end gap-4 w-full border-b border-bg-border px-2 py-4">
    <SunMoon @click="themeStore.toggleTheme" class="cursor-pointer" :size="20" />
    <div class="relative cursor-pointer">
      <Bell @click="navigateToNotifications" :size="20" />

      <span
        class="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white"
      >
        {{ notificationsCount }}
      </span>
    </div>
    <div>
      <p class="cursor-pointer" @click="navigateToMyProfile">
        {{ userStore.user?.username }}
      </p>
    </div>
  </div>
</template>
