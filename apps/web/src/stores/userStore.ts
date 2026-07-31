import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import type { RegisterDTO, LoginDTO } from "@classroom/shared";
import type { User } from "@classroom/shared";

const API_URL = import.meta.env.VITE_API_URL;

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  // SEE
  const unreadCount = ref(0);
  let sseSource: EventSource | null = null;

  const connectSSE = () => {
    sseSource = new EventSource(API_URL);
    sseSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_notification") {
        unreadCount.value++;
      }
    };
  };

  const disconnectSSE = () => {
    sseSource?.close();
    sseSource = null;
  };

  // toggle theme right here

  const register = async (credentials: RegisterDTO) => {
    await api.post("/auth/register", credentials);
  };

  const login = async (credentials: LoginDTO) => {
    await api.post("/auth/login", credentials);
    await fetchUser();
  };

  // fetch user
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      user.value = res.data.user;
      console.log(user.value);
    } catch (error) {
      console.log(error);
      user.value = null; //cookie expired
    }
    // set the user ref right here
  };
  const logout = async () => {
    await api.post("/auth/logout");
    user.value = null;
  };

  const isLoggedIn = computed(() => !!user.value);
  return {
    user,
    isLoggedIn,
    unreadCount,
    sseSource,

    register,
    login,
    fetchUser,
    logout,
    connectSSE,
    disconnectSSE,
  };
});
