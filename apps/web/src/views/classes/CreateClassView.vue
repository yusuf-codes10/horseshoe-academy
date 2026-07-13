<script setup lang="ts">
import { ref } from 'vue';

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
    <label for="code">Subject name *</label>
    <BaseInput type="text" id="code" name="code" placeholder="Calculus I"/>
    <label for="">Department Code *</label>
    <BaseInput type="text" placeholder="MATH" />
    <label for="name">Subject Description</label>
    <BaseInput type="text" id="name" placeholder="Description..." :required="false" />
    <div v-if="error">
      <p class="text-sm text-red-500">{{ error }}</p>
    </div>
    <MainButton title="Create Subject" type="submit"  />
  </form>
</div>
  </div>
</template>
