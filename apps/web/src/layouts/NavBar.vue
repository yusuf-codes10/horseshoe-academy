<script setup lang="ts">
import MainButton from '@/components/shared/MainButton.vue';
// import SecondaryButton from '@/components/shared/SecondaryButton.vue';
</script>

<template>
  <nav class="flex justify-between items-center px-4 py-2 sticky w-full">
    <h1>ClassRoom</h1>
    <!-- <MainButton v-if="!userStroe.user" title="Log in" /> -->
    <div  class="flex justify-between items-center">
      <!-- <SecondaryButton :isGhost="false" :loading="false" title="Sign In"/> -->
      <MainButton title="Sign Up"/>
    </div>
  </nav>
</template>
