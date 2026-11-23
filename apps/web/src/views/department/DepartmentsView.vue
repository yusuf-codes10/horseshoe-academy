<script setup lang="ts">
import ActionsBar from "@/components/ActionsBar.vue";
import BaseInput from "@/components/BaseInput.vue";
import MainButton from "@/components/MainButton.vue";
import MainTable from "@/components/MainTable.vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { hasPermession } from "@/libs/permessions";
import { useUserStore } from "@/stores/userStore";
import { ref, onMounted } from "vue";
import PaginationBar from "@/components/PaginationBar.vue";
import { getAllDepartments } from '@/services/department.service';
import type { Department } from '@classroom/shared';
// import type { NewDepartment } from '@classroom/shared';

const departments = ref<Department[]>([]);
// const counts = ref([]);

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const limit = ref(3);
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

const loadDeps = async () => {
  const {deps, depsCount} = await getAllDepartments(departmentsPath, page.value, limit.value);
  departments.value = deps;
  count.value = depsCount;
}

// emit handler
const setRows = async (payload: number) => {
  page.value = payload;
  await loadDeps();
};

onMounted(async () => {
  await loadDeps();
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
