<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";
import type { NewUser, NewStudent, NewTeacher } from "@classroom/shared";
import { AxiosError } from "axios";

const userStore = useUserStore();
const route = useRoute();

const currentUser = ref<NewUser | NewUser & NewStudent | NewUser & NewTeacher | null>(null);
const error = ref('')

// this computed property should be the one to know if we are fetching our own or viwing another ser profile
const isMyProfile = computed(() => route.params.username === userStore.user!.username);

console.log(isMyProfile);

const fetchMyProfile = async () => {
  error.value = ''
  try {
    const response = await api.get("/users/me");
    console.log(response.data);
    currentUser.value = response.data.foundUser;
  } catch (err) {
    console.log(err);
    error.value = err instanceof AxiosError ? err.response?.data.msg : String(err)
  }
};

const fetchUserProfile = async () => {
  error.value = ''
  try {
    const response = await api.get(`/users/${route.params.username }`);
    console.log('found user is: ', response.data);
    currentUser.value = response.data.foundUser;
  } catch (err) {
    console.log(err);
    error.value = err instanceof AxiosError ? err.response?.data.msg : String(err)
  }
}

onMounted(async () => {
  if (isMyProfile.value) await fetchMyProfile();
  else {
    console.log("Oops not your profile");
    await fetchUserProfile();
  }
});
</script>

<template>
  <div>
    <h1 class="title">My Profile Page</h1>
    <p>{{ currentUser?.username }}</p>
  </div>
</template>
