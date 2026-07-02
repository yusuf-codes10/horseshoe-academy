import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { RegisterDTO } from '@classroom/shared';

export const useUserStore = defineStore('user', () => {

  const user = ref(null);
  // toggle theme right here

  const register = async (credentials: RegisterDTO) => {
    await api.post('/auth/register', credentials);
  }
  return {
    user,
    register
  }
})
