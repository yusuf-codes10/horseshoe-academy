<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import MainButton from '@/components/shared/MainButton.vue';

const error = ref('')
const loading = ref(false)

const createSubject = () => {

}
</script>

<template>
    <h1 class="title">Create Department</h1>
  <div class="flex justify-center items-center mx-4">
    <form
      @submit.prevent="createSubject"
      class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"
    >
      <label for="code">Subject name *</label>
      <BaseInput type="text" id="code" name="code" placeholder="Calculus I" />
      <label for="name">Subject Description</label>
      <BaseInput type="text" id="name" placeholder="Description..." />
      <div v-if="error">
        <p class="text-sm text-red-500">{{ error }}</p>
      </div>
      <MainButton title="Create Subject" type="submit" :loading="loading" />
    </form>
  </div>
</template>
