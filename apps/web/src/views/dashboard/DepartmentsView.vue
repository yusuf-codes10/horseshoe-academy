<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import MainTable from "@/components/shared/MainTable.vue";
import { useRouter } from "vue-router";
import { useRoute } from 'vue-router';

const departments = [
  { code: "CS", name: "Computer Science", subject_count: 12, description: "lorem" },
  { code: "EE", name: "Electrical Engineering", subject_count: 8, description: "lorem" },
];

const router = useRouter();
const route = useRoute();

const createDep = () => {
  router.push({ name: "CreateDepartment" });
};
</script>

<template>
  <div>
    <!-- <h2 class="title">Departments</h2> -->
    <ActionsBar title="Departments" description="lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Department" class="h-10" />
        <MainButton title="Create" @click="createDep" />
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
