import { defineStore } from 'pinia'
import { ref } from 'vue'
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
  }

  // TODO: we need a way to fetch the user from the cookie for login
  return {
    user,
    register,
    login
  }
})
