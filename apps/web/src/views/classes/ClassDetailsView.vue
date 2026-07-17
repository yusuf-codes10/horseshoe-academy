<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import api from '@/services/api';
const route = useRoute();

const loading = ref(false)
const error = ref('')

const getClassById = async () => {
  try {
    await api.get(`classes/${route.params.id}`)
  } catch (err) {
    console.log(err);
  }
}
console.log('this is the id', route.params.id);

</script>

<template>
  <div class="mx-4 my-6 flex flex-col gap-6">

    <!-- Header -->
    <div class="bg-popover border border-border rounded-xl p-6">
      <h1 class="text-xl font-semibold">Class Code {{ route.params.id }}</h1>
      <p class="text-text-muted text-sm mt-1">Class description goes here</p>
      <div class="flex gap-4 mt-4 text-sm text-text-muted">
        <span>Subject: <span class="text-text-primary">Calculus I</span></span>
        <span>Capacity: <span class="text-text-primary">18/30</span></span>
      </div>
    </div>

    <!-- Teacher -->
    <div class="bg-popover border border-border rounded-xl p-6">
      <h2 class="font-medium mb-4">Assigned Teacher</h2>
      <p class="text-text-muted text-sm">No teacher assigned yet.</p>
      <!-- or teacher name/info here -->
    </div>

    <!-- Students -->
    <div class="bg-popover border border-border rounded-xl p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-medium">Enrolled Students</h2>
        <button class="text-sm text-primary">+ Enroll Student</button>
      </div>
      <p class="text-text-muted text-sm">No students enrolled yet.</p>
      <!-- table goes here -->
    </div>

  </div>
</template>
