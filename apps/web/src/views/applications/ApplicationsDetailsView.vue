<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div>
    <h1 class="title">This is the {{ route.params.applicationId }} application</h1>
  </div>
</template>
