<script setup lang="ts">
import { ref } from "vue";
import BaseInput from "@/components/BaseInput.vue";
import MainButton from "@/components/MainButton.vue";
import { AxiosError } from "axios";
import { createSubject } from "@/services/subject.service";
import { useRouter } from "vue-router";
import type { Subject } from "@classroom/shared";

const name = ref("");
const code = ref("");
const description = ref("");

const error = ref("");
const loading = ref(false);

const router = useRouter();

// @classroom/shared
type NewSubject = Omit<Subject, 'id' | 'departmentId'> & {
  departmentCode: string
}

const create = async () => {
  const sub: NewSubject = {
    name: name.value,
    departmentCode: code.value,
    description: description.value,
  };
  loading.value = true;
  try {
    const created = await createSubject(sub);
    console.log(created);
    router.push({name: 'Subjects'});
  } catch (err) {
    error.value = err instanceof AxiosError ? err.response?.data.message : String(err);
    console.log("failed to create a subject", err);
    if (err instanceof AxiosError) {
      console.log(err.response?.data); // this will tell you exactly what the backend rejected
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <h1 class="title">Create Subject</h1>
  <div class="flex justify-center items-center mx-4">
    <form
      @submit.prevent="create"
      class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"
    >
      <label for="code">Subject name *</label>
      <BaseInput type="text" id="code" name="code" placeholder="Calculus I" v-model="name" />
      <label for="">Department Code *</label>
      <BaseInput type="text" placeholder="MATH" v-model="code" />
      <label for="name">Subject Description</label>
      <BaseInput
        type="text"
        id="name"
        placeholder="Description..."
        :required="false"
        v-model="description"
      />
      <div v-if="error">
        <p class="text-sm text-red-500">{{ error }}</p>
      </div>
      <MainButton title="Create Subject" type="submit" :loading="loading" />
    </form>
  </div>
</template>
