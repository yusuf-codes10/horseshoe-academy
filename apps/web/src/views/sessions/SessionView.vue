<script setup lang="ts">
import ActionsBar from "@/components/ActionsBar.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useUserStore } from "@/stores/userStore";
// import { hasPermession } from "@/libs/permessions";
import MainTable from "@/components/MainTable.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import { ref, onMounted } from "vue";
// import type { NewUser, NewTeacher } from "@classroom/shared";
import api from "@/services/api";

const sessions = ref([]);
const count = ref(0);
const page = ref(1);
const limit = ref(5);

const userStore = useUserStore();

// const currentUser = ref<
//   | (Omit<NewUser, "role"> & { role: "admin" })
//   | (Omit<NewUser, "role"> & NewTeacher & { role: "student" })
//   | (Omit<NewUser, "role"> & NewTeacher & { role: "teacher" })
//   | null
// >(null);

const getMySessions = async () => {
  try {
    const response = await api.get("/sessions/me");
    console.log("my sessions from sessions view: ", response.data);
    sessions.value = response.data.mySessions;
  } catch (error) {
    console.log(error);
  }
};

const getAllSessions = async () => {
  try {
    const response = await api.get(`/sessions/admin?page=${page.value}&limit=${limit.value}`);
    console.log("All sessions (for the admin): ", response.data);
    // sessions.value = response.data.allSessions;
    // count.value = response.data.sessionsCount;
    return {
      allSessions: response.data.allSessions,
      sessionsCount: response.data.sessionsCount,
    };
  } catch (error) {
    console.log(error);
  }
};

const setRows = async (payload: number) => {
  page.value = payload;
  const { allSessions, sessionsCount } = (await getAllSessions()) ?? { allSessions: [] };

  sessions.value = allSessions;
  count.value = sessionsCount;
};

onMounted(async () => {
  if (userStore.user && userStore.user.role === "teacher") {
    await getMySessions();
  } else {
    console.log("Sorry! You are not a teacher!");
    console.log("You are: ", userStore.user?.role);
    const { allSessions, sessionsCount } = (await getAllSessions()) ?? { allSessions: [] };
    sessions.value = allSessions;
    count.value = sessionsCount;
  }
});
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
        { key: 'id', label: 'ID' },
        { key: 'date', label: 'Date' },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status' },
        { key: 'classId', label: 'Class ID' },
      ]"
      :data="sessions"
      :loading="false"
    />
    <PaginationBar v-if="count" :count="count" @sendPage="setRows" />
  </div>
</template>
