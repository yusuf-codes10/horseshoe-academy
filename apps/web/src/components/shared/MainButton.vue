<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: "main" | "action";
    title?: string;
    type?: string;
    disabled?: boolean;
    loading?: boolean;
    isGhost?: boolean;
  }>(),
  {
    variant: "main",
    title: "Click",
    disabled: false,
    loading: false,
    isGhost: false,
  },
);
const emit = defineEmits(["click"]);
</script>

<template>
  <button
    :disabled="props.disabled || props.loading"
    @click="emit('click')"
    class="h-10 border-none px-4 py-2 rounded-md transition-opacity"
    :class="[
      props.variant === 'action' ? 'text-sm text-primary' : 'bg-primary text-primary-foreground',
      props.disabled || props.loading
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer hover:opacity-90',
    ]"
  >
    <div
      v-if="loading"
      class="animate-spin rounded-full mx-auto w-4 h-4 border-2 border-white/30 border-t-white"
    />
    {{ props.loading ? "" : props.title }}
  </button>
</template>
