<script setup lang="ts">
import MainTable from '@/components/shared/MainTable.vue';


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
