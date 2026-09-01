<script setup lang="ts">
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
// import type { NewDepartment } from "@classroom/shared";
import { ref } from "vue";
import { createDep } from "@/services/department.service";
import { AxiosError } from "axios";
import type { NewDepartment } from '@classroom/shared';

const code = ref("");
const name = ref("");
const loading = ref(false);
const error = ref<string>("");


  const create = async () => {
    const dep: NewDepartment = {code: code.value, name: name.value};
    const created  = await createDep(dep);
    console.log(created);
  }

// create a department
// const createDep = async () => {
//   loading.value = true;
//   try {
//     const createdDep = await api.post("/departments", {
//       code: code.value,
//       name: name.value,
//     });
//     console.log(createdDep);
//   } catch (err) {
//     console.log(err);
//     error.value = err instanceof AxiosError ? err.response?.data.message : String(err);
//   } finally {
//     loading.value = false;
//   }
// };
</script>

<template>
  <h1 class="title">Create Department</h1>
  <div class="flex justify-center items-center mx-4">
    <form
      @submit.prevent="create"
      class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"
    >
      <label for="code">Department code *</label>
      <BaseInput type="text" id="code" name="code" placeholder="CS" v-model="code" />
      <label for="name">Department name *</label>
      <BaseInput type="text" id="name" placeholder="Computer Science" v-model="name" />
      <div v-if="error">
        <p class="text-sm text-red-500">{{ error }}</p>
      </div>
      <MainButton title="Create Department" type="submit" :loading="loading" />
    </form>
  </div>
</template>
