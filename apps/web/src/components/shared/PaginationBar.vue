<script setup lang="ts">
import type { PropType } from 'vue';

type SelectOption = {
  value: string | number;
  title: string;
}

const props = defineProps({
  elements: {
    type: Array as PropType<SelectOption[]>
  }
});
</script>

<template>
  <div class="flex justify-end items-center">
    <!-- rows per page -->
    <label for="rows">Rows per page:</label>
    <select id="rows" name="rows">
      <option v-for="e in props.elements" :key="e.value" :value="e.value">{{e.title}}</option>
    </select>
  </div>
</template>
