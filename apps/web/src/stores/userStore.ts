import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { RegisterDTO, LoginDTO } from '@classroom/shared';

export const useUserStore = defineStore('user', () => {

  const user = ref(null);
  // toggle theme right here

  const register = async (credentials: RegisterDTO) => {
    await api.post('/auth/register', credentials);
  }

  const login = async (credentials: LoginDTO) => {
    await api.post('/auth/login', credentials);
    await fetchUser()
  }

  // fetch user
  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      user.value = res.data
      console.log(user.value);
    } catch (error) {
      console.log(error);
      user.value = null //cookie expired
    }
    // set the user ref right here

  }
  const logout = async () => {
    await api.post('/auth/logout');
    user.value = null
  }
  // TODO: we need a way to fetch the user from the cookie for login


  const isLoggedIn = computed(() => !!user.value)
  return {
    user,
    isLoggedIn,


    register,
    login,
    fetchUser,
    logout
  }
})
