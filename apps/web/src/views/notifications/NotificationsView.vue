<script setup lang="ts">
import { onMounted } from 'vue';
import api from '@/services/api';


const getMyNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    console.log(response.data);
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
      <h1 class="title">This is the notifications page</h1>
    </div>
  </div>
</template>
