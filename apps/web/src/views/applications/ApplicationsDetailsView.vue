<script setup lang="ts">
import { useRoute } from "vue-router";
import ActionsBar from "@/components/shared/ActionsBar.vue";
import MainButton from "@/components/shared/MainButton.vue";
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";
import { ref } from 'vue';
import api from '@/services/api';

const route = useRoute();
const userStore = useUserStore();

const foundApplication = ref();
const loading = ref(false);

const getApplicationById = async () => {
  loading.value = true
  try {

  } catch (error) {
    console.log(error);

  }
}
</script>

<template>
  <div class="mx-4 my-6 flex flex-col gap-6">
    <h1 class="title">This is the {{ route.params.applicationId }} application</h1>
    <ActionsBar :title="'Application'" description="lorem lorem lorem">
      <MainButton
        v-if="userStore.user && hasPermession(userStore.user, 'manage:applications')"
        :title="'Accept'"
        :loading="loading"
      />
      <MainButton
        v-if="userStore.user && hasPermession(userStore.user, 'manage:applications')"
        variant="action"
        title="Reject"
      />
    </ActionsBar>
  </div>
</template>
