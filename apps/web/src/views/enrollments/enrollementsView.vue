<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainTable from "@/components/shared/MainTable.vue";
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const userStore = useUserStore();

// type Enrollement = {

// }

const enrollements = ref([])

const enrollmentsPath = userStore.user?.role === 'student'
  ? 'enrollements/me'
  : 'enrollements';

const getEnrollements = async () => {
  try {
    const { data } = await api.get(`/${enrollmentsPath}`);
    const { enrolls } = data;
    console.log('ENROLLS HERE: ', enrolls);
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await getEnrollements();
})
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
          { key: 'enrollementId', label: 'ID'},
          { key: 'code', label: 'Code' },
          { key: 'subjectName', label: 'Subject' },
          { key: 'teacherName', label: 'Teacher' },
          { key: 'enrolledCount', label: 'Enrolled Students Number' }
        ]"
        :data="enrollements"
        :loading="true"
      />
    </div>
  </div>
</template>
