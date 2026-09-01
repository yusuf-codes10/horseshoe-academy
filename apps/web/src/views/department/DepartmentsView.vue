<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import MainTable from "@/components/shared/MainTable.vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { hasPermession } from "@/libs/permessions";
import { useUserStore } from "@/stores/userStore";
import { ref, onMounted } from "vue";
import api from "@/services/api";
import PaginationBar from "@/components/shared/PaginationBar.vue";
// import type { NewDepartment } from '@classroom/shared';

const departments = ref([]);
// const counts = ref([]);

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const rows = ref(5);
const page = ref(1);
const count = ref(0);

const departmentsPath = "departments";

const createDep = () => {
  router.push({ name: "CreateDepartment" });
};
if (userStore.user) {
  console.log(`user role is"${userStore.user.role}"`);
  console.log(userStore.user);
}

const fetchAllDeps = async () => {
  const response = await api.get(`/departments?page=${page.value}&limit=${rows.value}`);
  console.log(response.data.deps);
  // console.log(response.data.counts);
  // const departments: NewDepartment = response.data.deps;
  // const counts = response.data.counts
  // console.log(departments);
  // console.log(counts);
  return {
    deps: response.data.deps,
    depsCount: response.data.depsCount,
  };
};

// emit handler
const setRows = async (payload: number) => {
  page.value = payload;
  const data = await fetchAllDeps();
  // console.log('data is', data.counts.map(c => c.count));
  departments.value = data.deps;
  count.value = data.depsCount;
};

// fetch the real departments first
// :TODO fix the type here later
onMounted(async () => {
  const data = await fetchAllDeps();
  // console.log('data is', data.counts.map(c => c.count));
  departments.value = data.deps;
  count.value = data.depsCount;
  // .map((dep) => {
  //   const match = data.counts.find((c) => c.depId === dep.id);
  //   return {
  //     ...dep,
  //     subjects_count: match?.count ?? 0,
  //   };
  // });
  console.log(departments.value);
  console.log("count from dep", count.value);
});
</script>

<template>
  <div>
    <!-- <h2 class="title">Departments</h2> -->
    <ActionsBar title="Departments" description="lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Department" class="h-10" />
        <MainButton
          v-if="userStore.user && hasPermession(userStore.user, 'create:departments')"
          title="Create"
          @click="createDep"
        />
      </div>
    </ActionsBar>
    <RouterView v-if="route.name === 'CreateDepartment'" />
    <div v-else>
      <MainTable
        :columns="[
          { key: 'code', label: 'Code' },
          { key: 'name', label: 'Name' },
          { key: 'subjectsCount', label: 'Subjects' },
          { key: 'description', label: 'Description' },
          { key: 'details', label: 'Details' },
        ]"
        :data="departments"
        :loading="true"
      />
      <PaginationBar v-if="count" :count="count" @sendPage="setRows" />
    </div>
  </div>
</template>
