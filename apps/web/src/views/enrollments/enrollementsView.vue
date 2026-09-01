<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainTable from "@/components/shared/MainTable.vue";
import { ref, onMounted } from "vue";
import PaginationBar from "@/components/shared/PaginationBar.vue";
import { getAllEnrollements } from "@/services/enrollement.service";

const userStore = useUserStore();

// type Enrollement = {

// }

const enrollements = ref([]);
const countNumber = ref(0);

const rows = ref(5);
const page = ref(1);
const count = ref(0);

const enrollmentsPath = userStore.user?.role === "student" ? "enrollements/me" : "enrollements";

// const getEnrollements = async () => {
//   try {
//     const { data } = await api.get(`/${enrollmentsPath}`);
//     const { enrolls, count } = data;
//     console.log('ENROLLS HERE: ', enrolls);
//     enrollements.value = enrolls
//     countNumber.value = count
//   } catch (error) {
//     console.log(error);
//   }
// }

const loadEnrolls = async () => {
  const { enrolls, count } = await getAllEnrollements(enrollmentsPath);
  enrollements.value = enrolls;
  countNumber.value = count;
};

const setRows = async (payload: number) => {
  page.value = payload;
  await loadEnrolls();
};

onMounted(async () => {
  await loadEnrolls();
});
</script>

<template>
  <div>
    <ActionsBar title="Enrollements" description="lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Enrollement" class="h-10" />
        <MainButton
          v-if="userStore.user && hasPermession(userStore.user, 'create:departments')"
          title="Create"
          @click="'createDep'"
        />
      </div>
    </ActionsBar>

    <div>
      <MainTable
        :columns="[
          { key: 'enrollmentId', label: 'ID' },
          { key: 'code', label: 'Code' },
          { key: 'subjectName', label: 'Subject' },
          { key: 'teacherName', label: 'Teacher' },
          { key: 'enrolledCount', label: 'Enrolled Students Number' },
        ]"
        :data="enrollements"
        :loading="true"
      />
      <PaginationBar v-if="countNumber" :count="countNumber" @sendPage="setRows" />
    </div>
  </div>
</template>
