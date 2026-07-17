<script setup lang="ts">
// const props = defineProps({
//   title: {
//     type: String,
//     default: "Click",
//   },
//   type: String,
//   disabled: {
//     type: Boolean,
//     default: false,
//   },
//   loading: {
//     type: Boolean,
//     default: false,
//   },
//   isGhost: {
//     type: Boolean,
//     default: false,
//   },
// });
const props = withDefaults(defineProps<{
  variant?: 'main' | 'action';
  title?: string;
  type?: string;
  disabled?: boolean;
  loading?: boolean;
  isGhost?: boolean;
}>(), {
  variant: 'main',
  title: 'Click',
  disabled: false,
  loading: false,
  isGhost: false
});
const emit = defineEmits(["click"]);
</script>

<template>
  <button
    :disabled="props.disabled || props.loading"
    @click="emit('click')"
    class="h-10 border-none px-4 py-2 cursor-pointer rounded-md hover:opacity-90 transition-opacity"
    :class="props.variant === 'main' ? 'text-primary-foreground' : 'bg-primary text-primary-foreground'"
  >
    <div
      v-if="loading"
      class="animate-spin rounded-full mx-auto w-4 h-4 border-2 border-white/30 border-t-white"
    />
    {{ props.loading ? "" : props.title }}
  </button>
</template>
