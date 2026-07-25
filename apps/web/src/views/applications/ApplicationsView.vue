<script setup lang="ts">
import MainTable from '@/components/shared/MainTable.vue';
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useUserStore } from '@/stores/userStore';


const applications = ref([]);
const userStore = useUserStore();

// admin (all applications)
const getAllAplications = async () => {
  try {
    const response = await api.get('/applications');
    console.log('You are an admin: ', response.data);
    // return {
    //   allApplications: response.data.
    // }
  } catch (error) {
    console.log(error);
    console.log(error);
  }
}

// teacher (applications per class that belongs to this teacher)
const getApplicationsPerTeacher = () => {

}


// student (my applications)
const getMyApplications = async () => {
  try {
    const response = await api.get('/applications');
    console.log('You are a student: ', response.data);
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  if (userStore.user && userStore.user!.role === 'admin') {
    await getAllAplications();
  } else if (userStore.user && userStore.user.role === 'student') {
    await getMyApplications();
  }
})
</script>

<template>
  <div>
    <MainTable
      :columns="[
        {key: 'status', label: 'Status'},
        {key: 'studentId', label: 'Student ID'},
        {key: 'studentName', label: 'Student Name'},
        {key: 'classId', label: 'Class ID'},
      ]"
      :data="[]"
      :loading="true"
    />
  </div>
</template>
