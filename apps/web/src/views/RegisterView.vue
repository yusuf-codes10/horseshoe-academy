<script setup lang="ts">
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import { ref } from 'vue';

const isDragging = ref(false)
const previewUrl = ref(false)
</script>

<template>
  <div>
    <h1 class="title">Register</h1>
    <div
      class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-80 shadow-sm"
    >

          <div
        class="relative border border-dashed rounded-lg transition-all duration-200 cursor-pointer"
        :class="isDragging ? 'border-primary bg-accent' : 'border-border hover:border-input'"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="$refs.fileInput.click()"
      >
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
        <div v-if="previewUrl" class="relative">
          <img :src="previewUrl" alt="preview" class="w-full rounded-lg object-contain max-h-24" />
          <p class="absolute bottom-1 left-0 right-0 text-center text-muted-foreground text-xs">
            Click to change
          </p>
        </div>
        <div v-else class="py-4 flex flex-col items-center gap-2">
          <svg
            class="w-4 h-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div class="text-center">
            <p class="text-foreground text-xs">Drop a profile photo</p>
            <p class="text-muted-foreground text-xs">or click to browse</p>
          </div>
        </div>
      </div>
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
