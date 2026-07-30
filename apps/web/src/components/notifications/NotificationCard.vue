<script setup lang="ts">
import type { Notification } from '@classroom/shared';
import { useRouter } from 'vue-router';

defineProps<{
  notification: Notification;
}>();

const emit = defineEmits(['readMe']);

const router = useRouter();

// const navigateToAction = () => {
//   router.push(`/${notification.value.action}`)
// }
</script>

<template>
  <div class="border border-border rounded-xl p-6 flex items-center gap-6"
  :class="[notification.isRead ? 'bg-background' : 'bg-popover']"
  @click="emit('readMe')"
  >
    <h1>{{ notification.title }}</h1>
    <p>{{ notification.content }}</p>
  </div>
</template>
