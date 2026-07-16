<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import MainButton from '@/components/shared/MainButton.vue';

const code = ref('')
const capacity = ref(0)
const description = ref('')
const error = ref('')


</script>

<template>
  <div>
    <h1 class="title">Create Subject</h1>
<div class="flex justify-center items-center mx-4">
  <form
    @submit.prevent="''"
    class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"
  >
    <label for="code">Class Code *</label>
    <BaseInput type="text" id="code" name="code" placeholder="algebra-2026-a" v-model="code"/>
    <label for="">Class Capacity *</label>
    <BaseInput type="number" placeholder="23" v-model="capacity"/>
    <label for="name">Class Description</label>
    <BaseInput type="text" id="name" placeholder="Description..." :required="false" v-model="description"/>
    <div v-if="error">
      <p class="text-sm text-red-500">{{ error }}</p>
    </div>
    <MainButton title="Create Class" type="submit"  />
  </form>
</div>
  </div>
</template>
