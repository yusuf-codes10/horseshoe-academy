<script setup lang="ts">
// import type { PropType } from 'vue';

const props = defineProps({
  count: {
    type: Number
  }
});

console.log('the count is', props.count);

// const selectedRow = ref(10)
// TODO: complete the pagination functionality
</script>

<template>
  <div class="flex justify-end items-center my-4">
    <!-- rows per page -->
    <!-- <label for="rows">Rows per page:</label>
    <select id="rows" name="rows"  v-model="props.rows">
      <option v-for="e in props.elements" :key="e.value" :value="e.value">{{e.title}}</option>
    </select> -->
  </div>
</template>
