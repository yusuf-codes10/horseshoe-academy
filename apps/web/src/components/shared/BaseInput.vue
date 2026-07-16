<script setup lang="ts">
// const props = defineProps({
//   modelValue: String,
//   type: {
//     type: String,
//     default: 'text',
//   },
//   placeholder: {
//     type: String,
//   },
//   name: String,
//   id: String,
//   autocomplete: String,
//   required: {
//     type: Boolean,
//     default: true,
//   },
// })
const props = withDefaults(defineProps<{
  modelValue: string | number,
  type: string,
  placeholder: string,
  name: string,
  id: string,
  autocomplete: string,
  required: boolean
}>(), {

});

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <!-- simple inline cast to avoid null ts issue -->
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :type="props.type"
    :placeholder="props.placeholder"
    :required="props.required"
    :autocomplete="props.autocomplete"
    class="h-10 block w-full rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground placeholder:font-light placeholder:text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
  />
</template>
