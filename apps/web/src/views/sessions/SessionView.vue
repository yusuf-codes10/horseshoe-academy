<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";

const userStore = useUserStore();
</script>

<template>
  <div>
    <ActionsBar title="Sessions" description="lorem lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Class" class="h-10" />
        <MainButton
          v-if="userStore.user && hasPermession(userStore.user, 'create:sessions')"
          title="Create"
          @click="'createClass'"
        />
      </div>
    </ActionsBar>
  </div>
</template>
