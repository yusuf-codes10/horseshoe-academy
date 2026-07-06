<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();


</script>

<template>
  <div class="flex w-full p-2 bg-amber-600">
    {{ route.path }}
  </div>
</template>
