<script setup lang="ts">
import BaseInput from '@/components/shared/BaseInput.vue';
import MainButton from '@/components/shared/MainButton.vue';
import type { NewDepartment } from '@classroom/shared';
import { ref} from 'vue';
import api from '@/services/api';

const code = ref('')
const name = ref('')

const newDep = ref<NewDepartment | null>(null)

newDep.value = {
  code: code.value,
  name: name.value
}

// create a department
const createDep = async () => {
  try {
    await api.post('/departments', newDep.value)
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <h1 class="title">Create Department</h1>
  <div class="flex justify-center items-center mx-4">
    <form
    @submit.prevent="createDep"
    class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"
    >
    <label for="code">Department code *</label>
    <BaseInput type="text" id="code" name="code" placeholder="CS" v-model="code"/>
    <label for="name">Department name *</label>
    <BaseInput type="text" id="name" placeholder="Computer Science" v-model="name"/>
    <MainButton title="Create Department" type="submit"/>
    </form>
  </div>
</template>
