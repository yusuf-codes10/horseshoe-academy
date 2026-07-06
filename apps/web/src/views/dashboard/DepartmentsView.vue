<script setup lang="ts">
import MainTable from '@/components/shared/MainTable.vue';
const departments = [
  { code: 'CS', name: 'Computer Science', subject_count: 12, description: 'lorem' },
  { code: 'EE', name: 'Electrical Engineering', subject_count: 8, description: 'lorem' },
]

</script>

<template>
  <div>
    <h2 class="title">Departments</h2>
    <MainTable   :columns="[
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'subject_count', label: 'Subjects' },
    { key: 'description', label: 'Description' },
    {key: 'details', label: 'Details'}
  ]"
    :data="departments"
  :loading="true"
  />
  </div>
</template>
