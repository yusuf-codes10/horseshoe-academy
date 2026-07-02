<script setup lang="ts">
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
</script>

<template>
  <div class="flex justify-center items-center mx-4">
    <div
    class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"

    >
    <h1 class="title">Welcome Back</h1>
      <BaseInput placeholder="username" />
      <BaseInput placeholder="password" type="password" />
      <p class="sub-text hover:underline cursor-pointer">
        <RouterLink :to="{ name: 'Register' }">Don't have an account?</RouterLink>
      </p>

      <MainButton title="Sign up" />
    </div>
  </div>
</template>
