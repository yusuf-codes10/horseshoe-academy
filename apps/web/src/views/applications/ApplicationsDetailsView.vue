<script setup lang="ts">
import { useRoute } from "vue-router";
import ActionsBar from "@/components/shared/ActionsBar.vue";
import MainButton from "@/components/shared/MainButton.vue";
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const route = useRoute();
const userStore = useUserStore();

const applicationId = route.params.applicationId;

const application = ref();
const loading = ref(false);

const getApplicationById = async () => {
  try {
    const response = await api.get(`/applications/${applicationId}`);
    console.log(response.data);
    return response.data.foundApplication;
  } catch (error) {
    console.log(error);
  }
}

// accept application
const acceptApplication = async () => {
  loading.value = true
  try {
    // RPC-style
    await api.patch(`/enrollements/${applicationId}/accept`);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
}

onMounted(async() => {
  application.value = await getApplicationById();
})
</script>

<template>
  <div class="mx-4 my-6 flex flex-col gap-6">
    <ActionsBar :title="'Application #' + application?.id" description="Review and manage this application">
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

    <div v-if="application" class="flex flex-col gap-6">
      <!-- Status -->
      <div class="bg-popover border border-border rounded-xl p-6">
        <h2 class="font-medium mb-4">Application Status</h2>
        <span
          class="text-sm px-3 py-1 rounded-full"
          :class="{
            'bg-yellow-500/10 text-yellow-500': application.status === 'pending',
            'bg-green-500/10 text-green-500': application.status === 'accepted',
            'bg-red-500/10 text-red-500': application.status === 'rejected',
          }"
        >
          {{ application.status }}
        </span>
      </div>

      <!-- Student -->
      <div class="bg-popover border border-border rounded-xl p-6">
        <h2 class="font-medium mb-4">Student</h2>
        <div class="flex gap-4 text-sm text-text-muted">
          <span>Name: <span class="text-text-primary">{{ application.studentName }}</span></span>
          <span>ID: <span class="text-text-primary">{{ application.studentId }}</span></span>
        </div>
      </div>

      <!-- Class -->
      <div class="bg-popover border border-border rounded-xl p-6">
        <h2 class="font-medium mb-4">Class</h2>
        <div class="flex gap-4 text-sm text-text-muted">
          <span>Code: <span class="text-text-primary">{{ application.classCode }}</span></span>
          <span>Capacity: <span class="text-text-primary">{{ application.enrolledCount }}/{{ application.capacity }}</span></span>
        </div>
      </div>
    </div>

    <div v-else class="text-text-muted text-sm">Loading...</div>
  </div>
</template>
