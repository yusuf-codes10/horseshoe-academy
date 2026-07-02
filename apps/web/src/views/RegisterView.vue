<script setup lang="ts">
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
</script>

<template>
  <div>
    <h1 class="title">Register</h1>
    <div
      class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-80 shadow-sm"
    >
      <BaseInput placeholder="Full Name" />
      <BaseInput placeholder="username" />
      <BaseInput placeholder="email" type="email" />
      <BaseInput placeholder="password" type="password" />
      <p class="sub-text hover:underline cursor-pointer">
        <RouterLink :to="{ name: 'Login' }">Already have an account?</RouterLink>
      </p>

      <MainButton title="Log in" />
    </div>
  </div>
</template>
