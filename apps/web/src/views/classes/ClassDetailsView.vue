<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import api from "@/services/api";
import MainButton from "@/components/shared/MainButton.vue";

const route = useRoute();
const teachers = [
  {id: 1, name: 'Jake The Dog'},
  {id: 2, name: 'Bonnie Mcfarlane'},
  {id: 3, name: 'John Marston'},

]
const showDropdown = ref(true)

// TODO: should probably use whatever is on packages/shared
type FoundClass = {
  id: number;
  code: string;
  description?: string;
  capacity: number;
  subjectId: number;
  teacherId?: number;
  subjectName: string;
};

const foundClass = ref<FoundClass | null>(null);
const loading = ref(false);
// const error = ref('')

const getClassById = async () => {
  loading.value = true;
  try {
    const fetchedClass = await api.get(`classes/${route.params.classId}`);
    console.log(fetchedClass.data.foundClass);
    foundClass.value = fetchedClass.data.foundClass;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// patch request right here
// TODO: conditional render assign teacher + all teachers in a dropdown vs assigned teacher + delete
const assignTeacher = async () => {
  try {
    await api.patch(`/classes/${route.params.classId}`, {
      teacherId: 1,
    });
  } catch (error) {
    console.log(error);
  }
};

const showAvailableTeachers = async () => {
  try {
    const response = await api.get("/teachers");
    console.log(response.data.allTeachers);
  } catch (error) {
    console.log(error);
  }
};
console.log("this is the id", route.params.classId);

onMounted(async () => {
  await getClassById();
  await showAvailableTeachers();
});
</script>

<template>
  <div class="mx-4 my-6 flex flex-col gap-6">
    <!-- Header -->
    <div v-if="foundClass" class="bg-popover border border-border rounded-xl p-6">
      <h1 class="text-xl font-semibold">{{ foundClass.code }}</h1>
      <p v-if="foundClass.description" class="text-text-muted text-sm mt-1">
        {{ foundClass.description }}
      </p>
      <div class="flex gap-4 mt-4 text-sm text-text-muted">
        <span
          >Subject: <span class="text-text-primary">{{ foundClass.subjectName }}</span></span
        >
        <span
          >Capacity: <span class="text-text-primary">{{ foundClass.capacity }}</span></span
        >
      </div>
    </div>

    <!-- Teacher -->
    <div class="flex justify-between relative">
      <h2 class="font-medium mb-4">Assigned Teacher</h2>
      <MainButton @click="showDropdown = !showDropdown" variant="action" title="Assign a Teacher" />

      <div
        v-if="showDropdown"
        class="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-10 w-48"
      >
        <ul>
          <li
            v-for="teacher in teachers"
            :key="teacher.id"
            @click="assignTeacher"
            class="px-4 py-2 text-sm hover:bg-white/5 cursor-pointer transition-colors"
          >
            {{ teacher.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Students -->
    <!-- This here should be a table -->
    <div class="bg-popover border border-border rounded-xl p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-medium">Enrolled Students</h2>
        <button class="text-sm text-primary cursor-pointer">+ Enroll Student</button>
      </div>
      <p class="text-text-muted text-sm">No students enrolled yet.</p>
      <!-- table goes here -->
    </div>
  </div>
</template>
