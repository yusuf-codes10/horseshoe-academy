<script setup lang="ts">
import MainTable from "@/components/shared/MainTable.vue";
import { ref, onMounted } from "vue";
import api from "@/services/api";
import { useUserStore } from "@/stores/userStore";
import PaginationBar from "@/components/shared/PaginationBar.vue";

const applications = ref([]);
const userStore = useUserStore();
const count = ref(0);
const page = ref(1);
const limit = ref(5);

const columns = [
  { key: "status", label: "Status" },
  { key: "studentId", label: "Student ID" },
  { key: "studentName", label: "Student Name" },
  { key: "classId", label: "Class ID" },
];

// admin (all applications)
const getAllAplications = async () => {
  try {
    const response = await api.get(`/applications?page=${page.value}&limit=${limit.value}`);
    console.log("You are an admin: ", response.data);
    return {
      allApplications: response.data.allApplications,
      appsCount: response.data.appsCount,
    };
  } catch (error) {
    console.log(error);
    console.log(error);
  }
};

// teacher (applications per class that belongs to this teacher)
const getApplicationsPerTeacher = async () => {
  try {
    const response = await api.get(`/applications?page=${page.value}&limit=${limit.value}`);
    console.log(response.data);
    return {
      allApplications: response.data.allApplications,
      appsCount: response.data.appsCount,
    };
  } catch (error) {
    console.log(error);
  }
};

// student (my applications)
const getMyApplications = async () => {
  try {
    const response = await api.get("/applications");
    console.log("You are a student: ", response.data);
    return {
      allApplications: response.data.allApplications,
      appsCount: response.data.appsCount,
    };
  } catch (error) {
    console.log(error);
  }
};

const setRows = async (payload: number) => {
  page.value = payload;
  if (userStore.user && userStore.user!.role === "admin") {
    const { allApplications, appsCount } = (await getAllAplications()) ?? { allApplications: [] };
    applications.value = allApplications;
    count.value = appsCount;
  } else if (userStore.user && userStore.user!.role === "student") {
    const { allApplications, appsCount } = (await getMyApplications()) ?? { allApplications: [] };
    applications.value = allApplications;
    count.value = appsCount;
  } else if (userStore.user && userStore.user!.role === "teacher") {
    const { allApplications, appsCount } = (await getApplicationsPerTeacher()) ?? {
      allApplications: [],
    };
    applications.value = allApplications;
    count.value = appsCount;
  }
};

onMounted(async () => {
  if (userStore.user && userStore.user!.role === "admin") {
    const { allApplications, appsCount } = (await getAllAplications()) ?? {
      allApplications: [],
      appsCount: 0,
    };
    applications.value = allApplications;
    count.value = appsCount;
  } else if (userStore.user && userStore.user.role === "student") {
    const { allApplications, appsCount } = (await getMyApplications()) ?? {
      allApplications: [],
      appsCount: 0,
    };
    applications.value = allApplications;
    count.value = appsCount;
  } else if (userStore.user && userStore.user!.role === "teacher") {
    const { allApplications, appsCount } = (await getApplicationsPerTeacher()) ?? {
      allApplications: [],
      appsCount: 0,
    };
    applications.value = allApplications;
    count.value = appsCount;
  }
});
</script>

<template>
  <div>
    <MainTable :columns="columns" :data="applications" :loading="true">
      <template #row="{ row }">
        <td v-for="col in columns" :key="col.key" class="py-3 px-4">
          <RouterLink :to="`/applications/${row.id}`" class="block">
            {{ row[col.key] }}
          </RouterLink>
        </td>
      </template>
    </MainTable>
    <PaginationBar v-if="count" :count="count" @sendPage="setRows" />
  </div>
</template>
<!-- TODO: Need to handle the setRows function -->
