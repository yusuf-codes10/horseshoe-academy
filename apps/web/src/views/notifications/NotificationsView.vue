<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";
import NotificationCard from "@/components/notifications/NotificationCard.vue";

const notifications = ref([]);

const getMyNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    console.log(response.data);
    return {
      allNotifications: response.data.allNotifications,
    };
  } catch (error) {
    console.log(error);
  }
};

const readMyNotification = async () => {
  try {
    const response = await api.patch("/notifications");
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  const { allNotifications } = (await getMyNotifications()) ?? { allNotifications: [] };
  notifications.value = allNotifications;
});
</script>

<template>
  <div class="flex justify-center items-center">
    <div
      v-if="notifications.length > 0"
      class="bg-popover border border-border rounded-xl p-6 w-120"
    >
      <NotificationCard
        v-for="(n, index) in notifications"
        :key="index"
        :notification="n"
        @readMe="readMyNotification"
      />
    </div>
    <div v-else>
      <h1>No notifications yet</h1>
    </div>
  </div>
</template>
