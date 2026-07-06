<script setup lang="ts">
import BaseInput from '@/components/shared/BaseInput.vue';
import MainButton from '@/components/shared/MainButton.vue';
import { NewDepartment } from '@classroom/shared';

</script>

<template>
  <h1 class="title">Create Department</h1>
  <div class="flex justify-center items-center mx-4">
    <form
    class="flex flex-col gap-2 bg-popover border border-border rounded-xl py-8 px-6 w-full my-4 md:w-90 shadow-sm"
    >
    <label for="code">Department code *</label>
    <BaseInput type="text" id="code" name="code" placeholder="CS"/>
    <label for="name">Department name *</label>
    <BaseInput type="text" id="name" placeholder="Computer Science"/>
    <MainButton title="Create Department"/>
    </form>
  </div>
</template>
