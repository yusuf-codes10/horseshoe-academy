<script setup lang="ts">
defineProps({
  title: String,
  description: String,
});
</script>

<template>
  <div class="flex justify-between items-center px-2 py-1">
    <!-- Left section | reusable with props -->
    <div class="flex flex-col">
      <h2 class="text-xl font-semibold text-foreground">{{ title }}</h2>
      <p class="text-sm text-muted-foreground mt-0.5">{{ description }}</p>
    </div>

    <!-- Right Section | slot, put whatever you want -->
    <div>
      <slot></slot>
    </div>
  </div>
</template>
