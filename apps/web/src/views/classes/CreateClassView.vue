<script setup lang="ts">
import { ref } from "vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import { AxiosError } from "axios";

const code = ref("");
const capacity = ref(0);
const description = ref("");
const subjectId = ref(0);
const loading = ref(false);
const error = ref("");

const router = useRouter();

const createClass = async () => {
  loading.value = true;
  try {
    const createdClass = await api.post("/classes", {
      code: code.value,
      capacity: capacity.value,
      description: description.value,
      subjectId: subjectId.value,
    });
    console.log(createdClass);
    router.push({name: 'Classes'});
  } catch (err) {
    console.log(err);
    error.value = err instanceof AxiosError ? err.response?.data.message : String(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <h1 class="title">Create Subject</h1>
    <div class="flex justify-center items-center mx-4">
      <form
        @submit.prevent="createClass"
        class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"
      >
        <label for="code">Class Code *</label>
        <BaseInput type="text" placeholder="algebra-2026-a" v-model="code" />
        <label for="">Class Capacity *</label>
        <BaseInput type="number" placeholder="23" v-model="capacity" />
        <label for="">Class Description</label>
        <BaseInput
          type="text"
          placeholder="Description..."
          :required="false"
          v-model="description"
        />
        <label for="name">Subject ID</label>
        <BaseInput type="number" placeholder="2" v-model="subjectId" />
        <div v-if="error">
          <p class="text-sm text-red-500">{{ error }}</p>
        </div>
        <MainButton title="Create Class" type="submit" />
      </form>
    </div>
  </div>
</template>
