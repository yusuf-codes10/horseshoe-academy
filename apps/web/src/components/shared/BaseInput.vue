<script setup lang="ts">
const props = defineProps({
  modelValue: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
  },
  name: String,
  id: String,
  autocomplete: String,
  required: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    :type="props.type"
    :placeholder="props.placeholder"
    :required="props.required"
    :autocomplete="props.autocomplete"
    class="mt-6 block w-full rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground placeholder:font-light placeholder:text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
  />
</template>
