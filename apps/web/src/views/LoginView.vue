<script setup lang="ts">
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { loginSchema } from "@classroom/shared";

const userStore = useUserStore();
const router = useRouter();

const username = ref("");
const password = ref("");

const error = ref(false);
const loading = ref(false);

const logUserIn = async () => {
  loading.value = true;

  const result = loginSchema.safeParse({
    username: username.value,
    password: password.value,
  });

  if (!result.success) {
    console.log(result.error);
    return;
  }

  try {
    await userStore.login(result.data);
    router.push('/dashboard');
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center items-center mx-4">
    <div
      class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"
    >
      <h1 class="title">Welcome Back</h1>
      <BaseInput placeholder="username" v-model="username" />
      <BaseInput placeholder="password" type="password" v-model="password" />
      <p class="sub-text hover:underline cursor-pointer">
        <RouterLink :to="{ name: 'Register' }">Don't have an account?</RouterLink>
      </p>

      <div v-if="error">something went wrong!</div>

      <MainButton title="Sign up" :loading="loading" />
    </div>
  </div>
</template>
