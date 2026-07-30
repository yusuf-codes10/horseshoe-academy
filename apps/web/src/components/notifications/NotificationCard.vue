<script setup lang="ts">
import type { Notification } from '@classroom/shared';

defineProps<{
  notification: Notification;
}>();

defineEmits(['read']);
</script>

<template>
  <div class="border border-border rounded-xl p-6 flex items-center gap-6"
  :class="[notification.isRead ? 'bg-background' : 'bg-popover']"
  >
    <h1>{{ notification.title }}</h1>
    <p>{{ notification.content }}</p>
  </div>
</template>
