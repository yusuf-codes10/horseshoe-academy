<script setup lang="ts">
import ActionsBar from "@/components/ActionsBar.vue";
import BaseInput from "@/components/BaseInput.vue";
import MainTable from "@/components/MainTable.vue";
// import PaginationBar from "@/components/shared/PaginationBar.vue";
import { getStudents } from "@/services/students.service";
import { ref, onMounted } from "vue";

// Derived from the service so extra fields (username, email, fullName...) are typed too
type StudentRow = Awaited<ReturnType<typeof getStudents>>["allStudents"][number];

const students = ref<StudentRow[]>([]);
const loading = ref(false);

// const count = ref(0);
// const page = ref(1);
// const limit = ref(5);

type Column<T> = { key: keyof T & string; label: string };


const columns: Column<StudentRow>[] = [
  { key: "id", label: "ID" },
  { key: "fullName", label: "Full Name" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "gpa", label: "GPA" },
];

const loadStudents = async (): Promise<void> => {
  loading.value = true;
  try {
    const { allStudents } = await getStudents();
    students.value = allStudents;
  } finally {
    loading.value = false;
  }
};

// Once the service supports pagination:
// const setRows = async (payload: number) => {
//   page.value = payload;
//   await loadTeachers();
// };

onMounted(loadStudents);
</script>

<template>
  <div>
    <ActionsBar title="Students" description="lorem lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Student" class="h-10" />
      </div>
    </ActionsBar>

    <div>
      <MainTable :columns="columns" :data="students" :loading="loading">
        <template #row="{ row }">
          <td v-for="col in columns" :key="col.key" class="py-3 px-4">
            <RouterLink :to="`/${row.username}`" class="block">
              {{ row[col.key] }}
            </RouterLink>
          </td>
        </template>
      </MainTable>

      <!-- Pagination placeholder: enable when the service returns a count -->
      <!-- <PaginationBar v-if="count" :count="count" @sendPage="setRows" /> -->
    </div>
  </div>
</template>
