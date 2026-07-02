import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { NewUser } from '@classroom/shared';

export const useUserStore = defineStore('user', () => {

  const user = ref(null);
  // toggle theme right here

  const register = async (credentials: NewUser) => {
    await api.post('/auth/register', credentials);
  }
  return {
    user,
    register
  }
})
