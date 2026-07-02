<script setup lang="ts">
import MainButton from '@/components/shared/MainButton.vue';


</script>

<template>
  <nav class="flex justify-between items-center px-4 py-2 fixed w-full">
    <h1>ClassRoom</h1>
    <!-- <MainButton v-if="!userStroe.user" title="Log in" /> -->
    <div  class="flex justify-between items-center">
      <MainButton />
    </div>
  </nav>
</template>
