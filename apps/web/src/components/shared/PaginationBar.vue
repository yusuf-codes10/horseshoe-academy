<script setup lang="ts">
const props = defineProps({
  elements: Array
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
