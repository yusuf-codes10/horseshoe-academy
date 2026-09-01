<script setup lang="ts">
import ActionsBar from "@/components/shared/ActionsBar.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import MainButton from "@/components/shared/MainButton.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { useRoute } from 'vue-router';
import { hasPermession } from "@/libs/permessions";
import MainTable from "@/components/shared/MainTable.vue";
import { ref, onMounted } from 'vue';
import PaginationBar from "@/components/shared/PaginationBar.vue";
import { getSubjects } from '@/services/subject.service';
import type { Subject } from "@classroom/shared";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const subjects = ref<Subject[]>([]);

const limit = ref(5);
const page = ref(1);
const count = ref(0)

const createSubject = () => {
  router.push({name: 'CreateSubject'})
}

const loadSubjects = async () => {
  const { subjectsCount, subs} = await getSubjects(page.value, limit.value);
  subjects.value = subs;
  count.value = subjectsCount;
 }

// const getAllSubjects = async () => {
//   const response = await api.get(`/subjects?page=${page.value}&limit=${limit.value}`);
//   console.log(response.data.subs);
//   return {
//     subs: response.data.subs,
//     subsCount: response.data.subjectsCount
//   };
// }

// emit handler
const setRows = async (payload: number) => {
  page.value = payload;
  await getSubjects();
}

onMounted(async () => {
  await loadSubjects();
})
</script>

<template>
  <div v-if="route.name !== 'CreateSubject'">
    <ActionsBar title="Subjects" description="lorem lorem lorem">
      <div class="flex gap-2">
        <BaseInput type="search" placeholder="Search Subject" class="h-10" />
        <MainButton
          v-if="userStore.user && hasPermession(userStore.user, 'create:departments')"
          title="Create"
          @click="createSubject"
        />
      </div>
    </ActionsBar>
    <div >
      <MainTable
        :columns="[
          {key: 'id', label: 'ID'},
          {key: 'name', label: 'Name'},
          {key: 'description', label: 'Description'},
          {key: 'departmentCode', label: 'Department'}
        ]"
        :data="subjects"
        :loading="true"
      />
      <PaginationBar v-if="count" :count="count" @sendPage="setRows"/>
    </div>
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>
