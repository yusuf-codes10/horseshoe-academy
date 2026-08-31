<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";

const userStore = useUserStore();
</script>

<template>
  <div>
    <ActionsBar title="Enrollements" description="lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Enrollement" class="h-10" />
        <MainButton
          v-if="userStore.user && hasPermession(userStore.user, 'create:departments')"
          title="Create"
          @click="'createDep'"
        />
      </div>
    </ActionsBar>
  </div>
</template>
