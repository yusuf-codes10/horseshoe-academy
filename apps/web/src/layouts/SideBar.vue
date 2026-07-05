<script setup lang="ts">
import { useSideStore } from '@/stores/sideStore';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const sideStore = useSideStore();
</script>

<template>
  <aside
        :class="[
      // base styles
      'h-screen flex flex-col bg-bg-surface text-text-primary border-r border-bg-border',
      // width phase (desktop only)
      sideStore.isOpen ? 'w-60' : 'w-17.5',
      // width transition (desktop only)
      'transition-[width] duration-300 ease-in-out',
      // positioning
      'fixed md:relative z-40',
    ]"
  >
  </aside>
</template>
