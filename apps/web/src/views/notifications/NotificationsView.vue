<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import NotificationCard from '@/components/notifications/NotificationCard.vue';


const notifications = ref([]);

const getMyNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    console.log(response.data);
    return {
      notifications: response.data
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(async() => {
  await getMyNotifications();
})
</script>

<template>
  <div class="flex justify-center items-center">
    <div class="bg-popover border border-border rounded-xl p-6 w-120">
      <NotificationCard />
    </div>
  </div>
</template>
