<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import api from "@/services/api";

const userStore = useUserStore();
const route = useRoute();

// this computed property should be the one to know if we are fetching our own or viwing another ser profile
const isMyProfile = computed(() => route.params.username === userStore.user!.username);

console.log(isMyProfile);

const fetchMyProfile = async () => {
  try {
    const response = await api.get("/users/me");
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  if (isMyProfile.value) await fetchMyProfile();
  else {
    console.log("Oops not your profile");
  }
});
</script>

<template>
  <div>
    <h1 class="title">My Profile Page</h1>
  </div>
</template>
