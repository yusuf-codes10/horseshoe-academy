<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import MainTable from "@/components/shared/MainTable.vue";
import api from "@/services/api";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import PaginationBar from "@/components/shared/PaginationBar.vue";

const userStore = useUserStore();

const route = useRoute();
const router = useRouter();

const classes = ref([]);
const count = ref(0);
const page = ref(1);
const rows = ref(5);

const fetchAllClasses = async () => {
  try {
    const response = await api.get(`/classes?page=${page.value}&limit=${rows.value}`);
    console.log(response.data.fetchedClasses);
    return {
      allClasses: response.data.fetchedClasses,
      classesCount: response.data.classesCount,
    };
  } catch (error) {
    console.log(error);
  }
};

// emit handler
const setRows = async (payload: number) => {
  page.value = payload;
  const { allClasses, classesCount } = (await fetchAllClasses()) ?? { allClasses: [] };
  classes.value = allClasses;
  count.value = classesCount;
};

const columns = [
  { key: "id", label: "ID" },
  { key: "capacity", label: "Capacity" },
  { key: "subjectName", label: "Subject Name" },
  { key: "subjectId", label: "Subject Id" },
  { key: "teacherId", label: "Teacher Id" },
];

const createClass = () => {
  router.push({ name: "CreateClass" });
};

onMounted(async () => {
  const { allClasses, classesCount } = (await fetchAllClasses()) ?? { allClasses: [] };
  classes.value = allClasses;
  count.value = classesCount;
});
</script>

<template>
  <div v-if="route.name !== 'CreateClass'">
    <ActionsBar title="Classes" description="lorem lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Class" class="h-10" />
        <MainButton
          v-if="userStore.user && hasPermession(userStore.user, 'create:departments')"
          title="Create"
          @click="createClass"
        />
      </div>
    </ActionsBar>

    <div>
      <MainTable :columns="columns" :data="classes" :loading="false">
        <template #row="{ row }">
          <td v-for="col in columns" :key="col.key" class="py-3 px-4">
            <RouterLink :to="`/classes/${row.id}`" class="block">
              {{ row[col.key] }}
            </RouterLink>
          </td>
        </template>
      </MainTable>
      <PaginationBar v-if="count" :count="count" @sendPage="setRows" />
    </div>
  </div>
  <RouterView v-else />
</template>
