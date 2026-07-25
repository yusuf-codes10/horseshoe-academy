import DashboardView from '@/views/DashboardView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import DashHomeView from '@/views/DashboardHome.vue'
import DepartmentsView from '@/views/department/DepartmentsView.vue'
import SubjectsView from '@/views/subject/SubjectsView.vue'
import CreateDepView from '@/views/department/CreateDepView.vue'
import CreateSubjectView from '@/views/subject/CreateSubjectView.vue'
import { hasPermession } from '@/libs/permessions';

import type { Permession } from '@/libs/permessions';
import ClassesView from '@/views/classes/ClassesView.vue'
import CreateClassView from '@/views/classes/CreateClassView.vue'
import ClassDetailsView from '@/views/classes/ClassDetailsView.vue'
import UserProfileView from '@/views/users/UserProfileView.vue'
import SessionView from '@/views/sessions/SessionView.vue'
import ApplicationsView from '@/views/applications/ApplicationsView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean,
    guestOnly?: boolean,
    permission?: Permession
  }
}

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
        meta: { requiresAuth: true, permission: 'view:departments'} as const,
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
        component: SubjectsView,
        children: [
          {
            path: 'create',
            name: 'CreateSubject',
            component: CreateSubjectView
          }
        ]
      },
      {
        path: 'classes',
        name: 'Classes',
        component: ClassesView,
        children: [
          {
            path: 'create',
            name: 'CreateClass',
            component: CreateClassView
          }
        ]
      },
      {
        path: 'classes/:classId',
        name: 'ClasseDetails',
        component: ClassDetailsView
      },
      {
        path: 'sessions',
        name: 'Sessions',
        component: SessionView
      },
      {
        path: 'applications',
        name: 'Applications',
        component: ApplicationsView
      },
      {
        path: ':username',
        name: 'UserProfule',
        component: UserProfileView
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

  // guard routes for the roles
  if (to.meta.permission && authStore.user && !hasPermession(authStore.user, to.meta.permission)) {
  return { name: 'DashboardHome' } // or redirect wherever makes sense
}
})

// TODO: we need to protect the routes from non admin users too
export default router
