<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import MainTable from "@/components/shared/MainTable.vue";
import { useRouter } from "vue-router";
import { useRoute } from 'vue-router';
import { hasPermession } from "@/libs/permessions";
import { useUserStore } from "@/stores/userStore";
import { ref, onMounted } from 'vue';
import api from '@/services/api';
// import type { NewDepartment } from '@classroom/shared';

const departments = ref<any[]>([]);
const counts = ref<any[]>([]);

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const createDep = () => {
  router.push({ name: "CreateDepartment" });
};
if (userStore.user)  {
  console.log(`user role is"${userStore.user.role}"`)
  console.log(userStore.user);
}

const fetchAllDeps = async () => {
  const response = await api.get('/departments?includes=subjects_count%2Cmessi');
  console.log(response.data.deps);
  console.log(response.data.counts);
  // const departments: NewDepartment = response.data.deps;
  // const counts = response.data.counts
  // console.log(departments);
  // console.log(counts);
  return {
    deps: response.data.deps,
    counsts: response.data.counts
  }
}

// fetch the real departments first
onMounted(async() => {
  const data = await fetchAllDeps();
  console.log('data is', data);
  departments.value = data.deps;
  counts.value = data.counsts
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
        title="Create" @click="createDep" />
      </div>
    </ActionsBar>
    <RouterView v-if="route.name=== 'CreateDepartment'" />
    <MainTable
      v-else
      :columns="[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'subject_count', label: 'Subjects' },
        { key: 'description', label: 'Description' },
        { key: 'details', label: 'Details' },
      ]"
      :data="departments"
      :loading="true"
    />
  </div>
</template>
