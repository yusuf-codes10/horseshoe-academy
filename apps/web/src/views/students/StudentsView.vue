<script setup lang="ts">
import ActionsBar from "@/components/ActionsBar.vue";
import BaseInput from "@/components/BaseInput.vue";
import MainTable from "@/components/MainTable.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import { getStudents } from "@/services/students.service";
import { ref, onMounted } from "vue";
import UserAvatar from "@/components/UserAvatar.vue";


// Derived from the service so extra fields (username, email, fullName...) are typed too
type StudentRow = Awaited<ReturnType<typeof getStudents>>["allStudents"][number];

const students = ref<StudentRow[]>([]);
const loading = ref(false);

const count = ref(0);
const page = ref(1);
const limit = ref(5);

type Column<T> = { key: keyof T & string; label: string };


const columns: Column<StudentRow>[] = [
  { key: "id", label: "ID" },
  { key: "avatarUrl", label: "PIC"},
  { key: "fullName", label: "Full Name" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "gpa", label: "GPA" },
];

const loadStudents = async (): Promise<void> => {
  loading.value = true;
  try {
    const { allStudents, studentsCount } = await getStudents(page.value, limit.value);
    students.value = allStudents ?? [];
    count.value = studentsCount ?? 0;
  } finally {
    loading.value = false;
  }
};

// Once the service supports pagination:
const setRows = async (payload: number) => {
  page.value = payload;
  await loadStudents();
};

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
              <UserAvatar
                v-if="col.key === 'avatarUrl'"
                :src="row.avatarUrl"
                :name="row.fullName"
                :size="36"
              />
              <template v-else>{{ row[col.key] }}</template>
            </RouterLink>
          </td>
        </template>
      </MainTable>

      <!-- Pagination placeholder: enable when the service returns a count -->
      <PaginationBar v-if="count" :count="count" @sendPage="setRows" />
    </div>
  </div>
</template>
