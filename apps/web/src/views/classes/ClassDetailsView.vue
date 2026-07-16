<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div>
    <h1 class="title">Class Details</h1>
    This is the {{ route.params.classId }}th class
  </div>
</template>
