<script setup lang="ts">
import ActionsBar from "@/components/ActionsBar.vue";
import BaseInput from "@/components/BaseInput.vue";
import MainButton from "@/components/MainButton.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { hasPermession } from "@/libs/permessions";
import MainTable from "@/components/MainTable.vue";
import { ref, onMounted } from "vue";
import PaginationBar from "@/components/PaginationBar.vue";
import { getSubjects } from "@/services/subject.service";
import type { Subject } from "@classroom/shared";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const subjects = ref<Subject[]>([]);

const limit = ref(5);
const page = ref(1);
const count = ref(0);

const searchInput = ref<string>();

const createSubject = () => {
  router.push({ name: "CreateSubject" });
};

const loadSubjects = async () => {
  const { subjectsCount, subs } = await getSubjects(page.value, limit.value);
  subjects.value = subs;
  count.value = subjectsCount;
};

const searchSubject = async () => {
  const { subs, subjectsCount } = await getSubjects(
    `subjects?search=${searchInput.value}`,
    page.value,
    limit.value,
  );
  subjects.value = subs;
  count.value = subjectsCount;
};

// emit handler
const setRows = async (payload: number) => {
  page.value = payload;
  await getSubjects();
};

onMounted(async () => {
  await loadSubjects();
});
</script>

<template>
  <div v-if="route.name !== 'CreateSubject'">
    <ActionsBar title="Subjects" description="lorem lorem lorem">
      <div class="flex gap-2">
        <BaseInput
          v-model="searchInput"
          type="search"
          placeholder="Search Subject"
          class="h-10"
          @keyup.enter="searchSubject"
        />
        <MainButton
          v-if="userStore.user && hasPermession(userStore.user, 'create:departments')"
          title="Create"
          @click="createSubject"
        />
      </div>
    </ActionsBar>
    <div>
      <MainTable
        :columns="[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'description', label: 'Description' },
          { key: 'departmentCode', label: 'Department' },
        ]"
        :data="subjects"
        :loading="true"
      />
      <PaginationBar v-if="count" :count="count" @sendPage="setRows" />
    </div>
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>
