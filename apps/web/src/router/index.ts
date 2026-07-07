import DashboardView from '@/views/DashboardView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import DashHomeView from '@/views/dashboard/HomeView.vue'
import DepartmentsView from '@/views/dashboard/DepartmentsView.vue'
import SubjectsView from '@/views/dashboard/SubjectsView.vue'
import CreateDepView from '@/views/dashboard/CreateDepView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { guestOnly: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: DashHomeView
      },
      {
        path: 'departments',
        name: 'Departments',
        component: DepartmentsView,
        children: [
          {
            path: 'create',
            name: 'CreateDepartment',
            component: CreateDepView
          }
        ]
      },
      {
        path: 'subjects',
        name: 'Subjects',
        component: SubjectsView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// runs before every route, guarantees user is resolved before any component mounts
router.beforeEach(async (to) => {
  const authStore = useUserStore()
  if (authStore.user === null) {
    await authStore.fetchUser()
  }

  if (to.meta.requiresAuth && !authStore.user) {
    return { name: 'Login' } // block + redirect
  }

  // Guest Only guard
  if (to.meta.guestOnly && authStore.user) {
    return { name: 'Dashboard' }
  }
})

// TODO: we need to protect the routes from non admin users too
export default router
