<script setup lang="ts">
import MainTable from '@/components/shared/MainTable.vue';
import { ref } from 'vue';
import api from '@/services/api';


// admin (all applications)
const getAllAplications = async () => {
  try {
    const response = await api.get('/applications');
    console.log('You are an admin: ', response.data);
  } catch (error) {
    console.log(error);
    console.log(error);
  }
}

// teacher (applications per class that belongs to this teacher)
const getApplicationsPerTeacher = () => {

}


// student (my applications)
const getMyApplications = () => {

}
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
