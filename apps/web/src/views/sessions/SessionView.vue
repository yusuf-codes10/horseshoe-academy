<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import { useUserStore } from "@/stores/userStore";
// import { hasPermession } from "@/libs/permessions";
import MainTable from "@/components/shared/MainTable.vue";
import { ref, onMounted } from 'vue';
import type { NewUser, NewTeacher } from "@classroom/shared";
import api from '@/services/api';

const sessions = ref([])

const currentUser = ref<
  | (Omit<NewUser, "role"> & { role: "admin" })
  | (Omit<NewUser, "role"> & NewTeacher & { role: "student" })
  | (Omit<NewUser, "role"> & NewTeacher & { role: "teacher" })
  | null
>(null);

const getMySessions = async () => {
  try {
    const response = await api.get('/sessions/me');
    console.log('my sessions from sessions view: ', response.data);
    sessions.value = response.data.mySessions;
  } catch (error) {
    console.log(error);
  }
}

const userStore = useUserStore();

onMounted(async () => {
  if (userStore.user && userStore.user.role === 'teacher') {
    await getMySessions();
  } else {
    console.log('Sorry! You are not a teacher!');
    console.log('You are: ', userStore.user?.role);

  }
})
</script>

<template>
  <div>
    <ActionsBar title="Sessions" description="lorem lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Class" class="h-10" />
      </div>
    </ActionsBar>

    <MainTable
      :columns="[
        {key: 'id', label: 'ID'},
        {key: 'date', label: 'Date'},
        {key: 'location', label: 'Location'},
        {key: 'status', label: 'Status'},
        {key: 'classId', label: 'Class ID'},
      ]"
      :data="sessions"
      :loading="false"
    />
  </div>
</template>
