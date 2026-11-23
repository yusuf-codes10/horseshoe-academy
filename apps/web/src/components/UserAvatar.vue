<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    src?: string | null;
    name?: string | null;
    size?: number; // px
  }>(),
  { size: 80 },
);

const initials = computed(() => {
  const words = (props.name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
});
</script>

<template>
  <div
    class="rounded-full bg-accent border border-border flex items-center justify-center font-bold text-primary shrink-0 overflow-hidden"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size / 3}px` }"
  >
    <img v-if="src" :src="src" :alt="name ?? 'avatar'" class="w-full h-full object-cover" />
    <span v-else>{{ initials }}</span>
  </div>
</template>
