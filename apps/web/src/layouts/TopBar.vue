<script setup lang="ts">
import SecondaryButton from "@/components/shared/SecondaryButton.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { Bell } from 'lucide-vue-next'

const userStore = useUserStore();
const router = useRouter();

const logout = async () => {
  await userStore.logout();
  router.push("/");
};

const navigateToMyProfile = () => {
  router.push(`/${userStore.user?.username}`);
};
</script>

<template>
  <div class="flex justify-end items-center w-full border-b border-bg-border">
    <Bell :size="20" class="cursor-pointer"/>
    <SecondaryButton title="logout" class="mb-3" @click="logout" />
    <div>
      <p class="cursor-pointer" @click="navigateToMyProfile">
        {{ userStore.user?.username }}
      </p>
    </div>
  </div>
</template>
