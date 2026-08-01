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

  const connectSSE = async () => {
    console.log("Connecting SSE...");

    const res = await api.get("/auth/sse-token");
    const { token } = res.data;
    sseSource = new EventSource(`${API_URL}/stream?token=${token}`);

    sseSource.onopen = () => {
      console.log("SSE connected");
    };
    sseSource.onmessage = (event) => {
      console.log("SSE:", event.data);

      const data = JSON.parse(event.data);
      if (data.type === "new_notification") {
        unreadCount.value++;
      }
    };
    sseSource.onerror = (err) => {
      console.log("SSE error:", err);
    };
  };

  // ! testing...
  // const connectSSE = () => {
  //   console.log("Connecting SSE...");

  //   sseSource = new EventSource(`${API_URL}/stream`, {
  //     withCredentials: true,
  //   });

  //   sseSource.onopen = () => {
  //     console.log("SSE connected");
  //   };

  //   sseSource.onmessage = (event) => {
  //     console.log("SSE:", event.data);
  //   };

  //   sseSource.onerror = (error) => {
  //     console.log("SSE error:", error);
  //   };
  // };

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

      // calling the SSE connection
      if (!sseSource) {
        connectSSE();
      }
    } catch (error) {
      console.log(error);
      user.value = null; //cookie expired
      disconnectSSE();
    }
    // set the user ref right here
  };
  const logout = async () => {
    await api.post("/auth/logout");
    user.value = null;
    disconnectSSE(); // clean up on logout
  };

  const isLoggedIn = computed(() => !!user.value);
  return {
    user,
    isLoggedIn,
    unreadCount,

    register,
    login,
    fetchUser,
    logout,
  };
});
