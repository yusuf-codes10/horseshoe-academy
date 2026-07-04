<script setup lang="ts">
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { loginSchema } from "@classroom/shared";
import { AxiosError } from "axios";

const userStore = useUserStore();
const router = useRouter();

const username = ref("");
const password = ref("");

const error = ref('');
const loading = ref(false);

const logUserIn = async () => {

  const result = loginSchema.safeParse({
    username: username.value,
    password: password.value,
  });

  if (!result.success) {
    console.log(result.error);
    return;
  }

  loading.value = true;
  error.value = ''
  try {
    await userStore.login(result.data);
    router.push("/dashboard");
  } catch (err) {
    console.log(err);
    error.value = err instanceof AxiosError ? err.response?.data.msg : String(err)
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center items-center mx-4">
    <form
      @submit.prevent="logUserIn"
      class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"
    >
      <h1 class="title">Welcome Back</h1>
      <BaseInput placeholder="username" v-model="username" />
      <BaseInput placeholder="password" type="password" v-model="password" />
      <p class="sub-text hover:underline cursor-pointer">
        <RouterLink :to="{ name: 'Register' }">Don't have an account?</RouterLink>
      </p>

      <div v-if="error">
        <p class="text-red-400 text.sm">{{ error }}</p>
      </div>

      <MainButton title="Sign up" :loading="loading" type="submit" />
    </form>
  </div>
</template>
