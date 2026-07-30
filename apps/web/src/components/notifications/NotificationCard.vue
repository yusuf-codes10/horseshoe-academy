<script setup lang="ts">
import type { Notification } from '@classroom/shared';
import { useRouter } from 'vue-router';

const p = defineProps<{
  notification: Notification;
}>();

const emit = defineEmits(['readMe']);

const router = useRouter();

const navigateToAction = () => {
  router.push(`/${p.notification.action}`);
}
</script>

<template>
  <div
    class="border border-border rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
    :class="[p.notification.isRead ? 'bg-background' : 'bg-popover']"
    @click="emit('readMe'), navigateToAction()"
  >
    <div v-if="!p.notification.isRead" class="mt-2 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
    <div v-else class="mt-2 w-2 h-2 rounded-full shrink-0" />

    <div class="flex flex-col gap-1 flex-1">
      <div class="flex items-center justify-between">
        <h1 class="text-sm font-medium">{{ p.notification.title }}</h1>
        <!-- your timestamp goes here -->
      </div>
      <p class="text-sm text-muted-foreground">{{ p.notification.content }}</p>
    </div>
  </div>
</template>
