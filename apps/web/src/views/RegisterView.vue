<script setup lang="ts">
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import { ref } from "vue";
import { School, GraduationCap } from "lucide-vue-next";
import {useUserStore} from '@/stores/userStore';
import { registerUserSchema } from '@classroom/shared';
import { useRouter } from "vue-router";


const userStore = useUserStore();
const router = useRouter();

const username = ref('')
const email = ref('')
const fullName = ref('')
const password = ref('')

const role = ref<'admin' | 'teacher' | 'student'>();

const isDragging = ref(false);
const previewUrl = ref(false);
const error = ref(false);
const loading = ref(false)


// send a post request
const registerUser = async () => {
  console.log('registering');
  loading.value = true
  // TODO: we have to vaidate with zod before hitting the api
  const result = registerUserSchema.safeParse({
    username: username.value,
    email: email.value,
    password: password.value,
    gender: 'female',
    role: role.value
  })

  if (!result.success) {
    console.log(result.error);
    return
  }
  try {
    await userStore.register(result.data)
    router.push('/dashboard')
  } catch (error) {
    console.log(error);

  } finally {
    loading.value= false
  }
}
</script>

<template>
  <div class="flex justify-center items-center mx-4">
    <form
    @submit.prevent="registerUser"
    class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-180 shadow-sm"
    >
    <h1 class="title">Register</h1>
      <!-- role selection -->
      <p class="sub-text">Select your role</p>
      <div class="flex gap-2">
        <div
          @click="role = 'teacher'"
          class="flex flex-col items-center gap-1 flex-1 border border-border rounded-lg p-2 cursor-pointer transition-all duration-150"
          :class="
            role === 'teacher'
              ? 'border-primary bg-accent text-accent-foreground'
              : 'hover:border-input hover:bg-accent'
          "
        >
          <School :size="16" />
          <span class="text-xs">Teacher</span>
        </div>
        <div
          @click="role = 'student'"
          class="flex flex-col items-center gap-1 flex-1 border border-border rounded-lg p-2 cursor-pointer transition-all duration-150"
          :class="
            role === 'student'
              ? 'border-primary bg-accent text-accent-foreground'
              : 'hover:border-input hover:bg-accent'
          "
        >
          <GraduationCap :size="16" />
          <span class="text-xs">Student</span>
        </div>
      </div>
      <!-- profile drop zone -->
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
      <!-- form -->
      <div class="flex flex-col md:flex-row gap-2">
        <BaseInput placeholder="Full Name" v-model="fullName"/>
        <BaseInput placeholder="username" v-model="username"/>
      </div>

      <div class="flex flex-col md:flex-row gap-2">
        <BaseInput placeholder="email" type="email" v-model="email"/>
        <BaseInput placeholder="password" type="password" v-model="password"/>
      </div>
      <p class="sub-text hover:underline cursor-pointer">
        <RouterLink :to="{ name: 'Login' }">Already have an account?</RouterLink>
      </p>

      <div v-if="error">
        <p>something went Wrong!</p>
      </div>

      <MainButton title="Sign Up" type="submit" :loading="loading"/>
    </form>
  </div>
</template>
