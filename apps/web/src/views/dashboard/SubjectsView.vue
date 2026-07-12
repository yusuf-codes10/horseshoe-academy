<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";
import MainTable from "@/components/shared/MainTable.vue";
import api from '@/services/api';
import { ref, onMounted } from 'vue';

const userStore = useUserStore();

const subjects = ref([]);

const getAllSubjects = async () => {
  const response = await api.get('/subject?page=1&limit=2');
  console.log(response.data.subs);
  return response.data.subs;
}

onMounted(async () => {
  subjects.value = await getAllSubjects();
})
</script>

<template>
  <div>
    <ActionsBar title="Subjects" description="lorem lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Subject" class="h-10" />
        <MainButton
          v-if="userStore.user && hasPermession(userStore.user, 'create:departments')"
          title="Create"
        />
      </div>
    </ActionsBar>

    <MainTable
      :columns="[
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'Name'},
        {key: 'description', label: 'Description'},
        {key: 'departmentId', label: 'Department ID'}
      ]"
      :data="subjects"
      :loading="true"
    />
  </div>
</template>
