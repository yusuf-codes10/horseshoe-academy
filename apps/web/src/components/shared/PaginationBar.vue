<script setup lang="ts">
import type { PropType } from 'vue';
// import { ref } from 'vue';

type SelectOption = {
  value: string | number;
  title: string;
}

const props = defineProps({
  elements: {
    type: Array as PropType<SelectOption[]>
  },
  rows: {
    type: Number
  }
});

// const selectedRow = ref(10)
// TODO: complete the pagination functionality
</script>

<template>
  <div class="flex justify-end items-center my-4">
    <!-- rows per page -->
    <label for="rows">Rows per page:</label>
    <select id="rows" name="rows"  v-model="props.rows">
      <option v-for="e in props.elements" :key="e.value" :value="e.value">{{e.title}}</option>
    </select>
  </div>
</template>
