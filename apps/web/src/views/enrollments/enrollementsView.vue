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
    const response = await api.get(`/${enrollmentsPath}`);
    console.log('ENROLLS HERE: ', response);
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
          { key: 'code', label: 'Code' },
          { key: 'name', label: 'Name' },
          { key: 'subjectsCount', label: 'Subjects' },
          { key: 'description', label: 'Description' },
          { key: 'details', label: 'Details' },
        ]"
        :data="enrollements"
        :loading="true"
      />
    </div>
  </div>
</template>
