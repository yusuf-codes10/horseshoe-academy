<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import MainTable from "@/components/shared/MainTable.vue";
import api from '@/services/api';
import { ref, onMounted} from 'vue';

const userStore = useUserStore();

const classes = ref([])

const fetchAllClasses = async () => {
  try {
    const response = await api.get('/classes');
    console.log(response.data.fetchedClasses);
    return {
      allClasses: response.data.fetchedClasses
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  const { allClasses} = await fetchAllClasses() ?? {allClasses: []};
  classes.value = allClasses
})
</script>

<template>
  <div>
    <ActionsBar title="Classes" description="lorem lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Class" class="h-10" />
        <MainButton
          v-if="userStore.user && hasPermession(userStore.user, 'create:departments')"
          title="Create"
        />
      </div>
    </ActionsBar>

    <MainTable
      :columns="[
        {key: 'id', label: 'ID'},
        {key: 'capacity', label: 'Capacity'},
        {key: 'subjectName', label: 'Subject Name'},
        {key: 'teacherId', label: 'Teacher Id'},
      ]"
      :data="[]"
      :loading="false"
    />
  </div>
</template>
