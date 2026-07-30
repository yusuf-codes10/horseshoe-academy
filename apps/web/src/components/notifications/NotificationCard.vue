<script setup lang="ts">
import type { Notification } from '@classroom/shared';
import { useRouter } from 'vue-router';

const p = defineProps<{
  notification: Notification;
}>();

const emit = defineEmits(['readMe']);

const router = useRouter();

const navigateToAction = () => {
  router.push(`/${p.notification.action}`)
}
</script>

<template>
  <div class="border border-border rounded-xl p-6 flex items-center gap-6"
  :class="[p.notification.isRead ? 'bg-background' : 'bg-popover']"
  @click="emit('readMe'), navigateToAction"
  >
    <h1>{{ p.notification.title }}</h1>
    <p>{{ p.notification.content }}</p>
  </div>
</template>
