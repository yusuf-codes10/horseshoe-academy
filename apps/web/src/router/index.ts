import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { hasPermession } from "@/libs/permessions";

import type { Permession } from "@/libs/permessions";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    permission?: Permession;
  }
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/RegisterView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "DashboardHome",
        component: () => import("@/views/DashboardHome.vue"),
      },
      {
        path: "departments",
        name: "Departments",
        component: () => import("@/views/department/DepartmentsView.vue"),
        meta: { requiresAuth: true, permission: "view:departments" } as const,
        children: [
          {
            path: "create",
            name: "CreateDepartment",
            component: () => import("@/views/department/CreateDepView.vue"),
          },
        ],
      },
      {
        path: "subjects",
        name: "Subjects",
        component: () => import("@/views/subject/SubjectsView.vue"),
        children: [
          {
            path: "create",
            name: "CreateSubject",
            component: () => import("@/views/subject/CreateSubjectView.vue"),
          },
        ],
      },
      {
        path: "classes",
        name: "Classes",
        component: () => import("@/views/classes/ClassesView.vue"),
        children: [
          {
            path: "create",
            name: "CreateClass",
            component: () => import("@/views/classes/CreateClassView.vue"),
          },
        ],
      },
      {
        path: "classes/:classId",
        name: "ClasseDetails",
        component: () => import("@/views/classes/ClassDetailsView.vue"),
      },
      {
        path: "sessions",
        name: "Sessions",
        component: () => import("@/views/sessions/SessionView.vue"),
      },
      {
        path: "applications",
        name: "Applications",
        component: () => import("@/views/applications/ApplicationsView.vue"),
      },
      {
        path: "applications/:applicationId",
        name: "ApplicationsDetails",
        component: () =>
          import("@/views/applications/ApplicationsDetailsView.vue"),
      },
      {
        path: "enrollements",
        name: "Enrollements",
        component: () => import("@/views/enrollments/enrollementsView.vue"),
      },
      {
        path: "notifications",
        name: "Notifications",
        component: () => import("@/views/notifications/NotificationsView.vue"),
      },
      {
        path: "teachers",
        name: "Teachers",
        component: () => import("@/views/teachers/TeachersView.vue"),
      },
      {
        path: "students",
        name: "Students",
        component: () => import("@/views/students/StudentsView.vue")
      },
      {
        path: ":username",
        name: "UserProfule",
        component: () => import("@/views/users/UserProfileView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// runs before every route, guarantees user is resolved before any component mounts
router.beforeEach(async (to) => {
  const authStore = useUserStore();
  if (authStore.user === null) {
    await authStore.fetchUser();
  }

  if (to.meta.requiresAuth && !authStore.user) {
    return { name: "Login" }; // block + redirect
  }

  // Guest Only guard
  if (to.meta.guestOnly && authStore.user) {
    return { name: "Dashboard" };
  }

  // guard routes for the roles
  if (to.meta.permission && authStore.user && !hasPermession(authStore.user, to.meta.permission)) {
    return { name: "DashboardHome" }; // or redirect wherever makes sense
  }
});

// TODO: we need to protect the routes from non admin users too
export default router;
