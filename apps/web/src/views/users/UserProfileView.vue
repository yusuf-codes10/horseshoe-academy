<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";
import type { NewUser, NewStudent, NewTeacher } from "@classroom/shared";
import { AxiosError } from "axios";
import MainButton from "@/components/shared/MainButton.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import UserAvatar from "@/components/UserAvatar.vue";

const userStore = useUserStore();
const route = useRoute();

const viewMode = ref(true);
const form = ref({
  fullName: "",
  username: "",
});
const loading = ref(false);

//TODO: dicrimate unions to distinguish between each branch
// const currentUser = ref<NewUser | (NewUser & NewStudent) | (NewUser & NewTeacher) | null>(null);
const currentUser = ref<
  | (Omit<NewUser, "role"> & { role: "admin" })
  | (Omit<NewUser, "role"> & NewStudent & { role: "student" })
  | (Omit<NewUser, "role"> & NewTeacher & { role: "teacher" })
  | null
>(null);

const error = ref("");

// this computed property should be the one to know if we are fetching our own or viwing another ser profile
const isMyProfile = computed(() => route.params.username === userStore.user!.username);

console.log(isMyProfile);

const fetchMyProfile = async () => {
  error.value = "";
  try {
    const response = await api.get("/users/me");
    console.log(response.data);
    currentUser.value = response.data.foundUser;

    // setting the form here
    form.value = {
      fullName: currentUser.value?.fullName,
      username: currentUser.value?.username,
    };
  } catch (err) {
    console.log(err);
    error.value = err instanceof AxiosError ? err.response?.data.message : String(err);
  }
};

const fetchUserProfile = async () => {
  error.value = "";
  try {
    const response = await api.get(`/users/${route.params.username}`);
    console.log("found user is: ", response.data);
    currentUser.value = response.data.foundUser;
  } catch (err) {
    console.log(err);
    error.value = err instanceof AxiosError ? err.response?.data.message : String(err);
  }
};

// edit my profile
const editMyProfile = async () => {
  // TODO: note: we should check if the data really changed or not so we do not waste an API call
  loading.value = true;
  try {
    const response = await api.patch("/users/me", {
      fullName: form.value.fullName.trim(),
      username: form.value.username.trim().toLowerCase(),
    });
    console.log(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (isMyProfile.value) {
    await fetchMyProfile();
    console.log("This is the current user data: ", currentUser.value);
  } else {
    console.log("Oops not your profile");
    await fetchUserProfile();
  }
});

const switchMode = () => {
  viewMode.value = !viewMode.value;
};

// ! In a union only all shared fields are safe, we have to narrow or use discriminated unions instead

// ! handling ABAC, atribute based permessions
const canEditProfile = computed(() => isMyProfile.value);
</script>

<template>
  <!-- Two approaches -->
  <!-- 1- make the fields read only! and various edit buttons to switch them -->
  <!-- 2- render a new edit field with one eidt button -->
  <div v-if="viewMode" class="mx-4 my-6 flex flex-col gap-6">
    <!-- Profile Header -->
    <div class="bg-popover border border-border rounded-xl p-6 flex items-center gap-6">
      <!-- Avatar -->
      <!-- <div
        class="w-20 h-20 rounded-full bg-accent border border-border flex items-center justify-center text-2xl font-bold text-primary shrink-0"
      >
        {{ currentUser?.fullName?.charAt(0) ?? "?" }}
      </div> -->
      <UserAvatar :name="currentUser?.fullName" />
      <!-- Name & username -->
      <div>
        <h1 class="text-2xl font-semibold">{{ currentUser?.fullName }}</h1>
        <p class="text-text-muted text-sm">@{{ currentUser?.username }}</p>
        <span
          class="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize"
        >
          {{ currentUser?.role }}
        </span>
      </div>

      <!-- edit profile -->
      <div class="ml-auto">
        <MainButton
          v-if="canEditProfile"
          @click="switchMode"
          variant="action"
          title="Edit Profile"
        />
      </div>
    </div>

    <!-- Basic Info -->
    <div class="bg-popover border border-border rounded-xl p-6 flex flex-col gap-3">
      <h2 class="font-medium mb-2">Basic Info</h2>
      <p class="text-sm text-text-muted">
        Email: <span class="text-text-primary">{{ currentUser?.email }}</span>
      </p>
      <p class="text-sm text-text-muted">
        Gender: <span class="text-text-primary capitalize">{{ currentUser?.gender }}</span>
      </p>
    </div>

    <!-- Teacher fields -->
    <div
      v-if="currentUser?.role === 'teacher'"
      class="bg-popover border border-border rounded-xl p-6 flex flex-col gap-3"
    >
      <h2 class="font-medium mb-2">Academic Info</h2>
      <p class="text-sm text-text-muted">
        Degree: <span class="text-text-primary">{{ currentUser?.degree }}</span>
      </p>
      <p class="text-sm text-text-muted">
        Major: <span class="text-text-primary">{{ currentUser?.major }}</span>
      </p>
    </div>

    <!-- Student fields -->
    <div
      v-if="currentUser?.role === 'student'"
      class="bg-popover border border-border rounded-xl p-6 flex flex-col gap-3"
    >
      <h2 class="font-medium mb-2">Academic Info</h2>
      <p class="text-sm text-text-muted">
        GPA: <span class="text-text-primary">{{ currentUser?.gpa }}</span>
      </p>
    </div>

    <div v-if="error">
      <p class="text-red-400 text-sm">{{ error }}</p>
    </div>
  </div>
  <!-- edit mode -->
  <div v-else>
    <h1 class="title">Edit mode</h1>
    <div class="bg-popover border border-border rounded-xl p-6 flex flex-col gap-3">
      <label for="">Full Name</label>
      <BaseInput type="text" placeholder="FullName" v-model="form.fullName" />

      <label for="">Username</label>
      <BaseInput placeholder="username" v-model="form.username" />

      <MainButton @click="editMyProfile" title="Edit Profile" :loading="loading" />
    </div>
  </div>
</template>
<!-- TODO: next: handle updating all cases for admin, teacher and student! -->
