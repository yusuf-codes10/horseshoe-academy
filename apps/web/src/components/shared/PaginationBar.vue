<script setup lang="ts">
// import type { PropType } from 'vue';
const props = defineProps({
  count: {
    type: Number,
    default: 1
  }
});

console.log('the count is', props.count);

const definePages = () => {
  if (!props.count) {
    const percentage = props.count * 0.33;
    console.log('the percentage is: ', percentage);
  }
}

definePages();

// const selectedRow = ref(10)
// TODO: complete the pagination functionality
</script>

<template>
  <div class="flex justify-end items-center my-4">
    <div class="w-10 h-10 border-2 p-2">
      1
    </div>
        <div class="w-10 h-10 border-2 p-2">
      2
    </div>    <div class="w-10 h-10 border-2 p-2">
      3
    </div>    <div class="w-10 h-10 border-2 p-2">
      4
    </div>
        <div class="w-10 h-10 border-2 p-2">
      {{ props.count }}
    </div>
    <!-- rows per page -->
    <!-- <label for="rows">Rows per page:</label>
    <select id="rows" name="rows"  v-model="props.rows">
      <option v-for="e in props.elements" :key="e.value" :value="e.value">{{e.title}}</option>
    </select> -->
  </div>
</template>
