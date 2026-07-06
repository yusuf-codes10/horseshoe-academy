<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import MainTable from "@/components/shared/MainTable.vue";
import { useRouter } from "vue-router";
import { useRoute } from 'vue-router';
import { hasPermession } from "@/libs/permessions";
import { useUserStore } from "@/stores/userStore";

const departments = [
  { code: "CS", name: "Computer Science", subject_count: 12, description: "lorem" },
  { code: "EE", name: "Electrical Engineering", subject_count: 8, description: "lorem" },
];

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const createDep = () => {
  router.push({ name: "CreateDepartment" });
};
if (userStore.user)  {
  console.log(`user role is"${userStore.user.role}"`)
}

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
