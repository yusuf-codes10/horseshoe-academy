<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import ActionsBar from "@/components/ActionsBar.vue";
import BaseInput from "@/components/BaseInput.vue";
import MainTable from "@/components/MainTable.vue";
import { ref, onMounted } from "vue";
import PaginationBar from "@/components/PaginationBar.vue";
import { getAllEnrollments } from "@/services/enrollement.service";

const userStore = useUserStore();

// type Enrollement = {

// }

const enrollements = ref([]);
const countNumber = ref(0);

const limit = ref(5);
const page = ref(1);

const enrollmentsPath = userStore.user?.role === "student" ? "enrollements/me" : "enrollements";

const loadEnrolls = async () => {
  const { enrolls, count } = await getAllEnrollments(enrollmentsPath, page.value, limit.value);
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
