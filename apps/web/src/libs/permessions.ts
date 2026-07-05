// src/libs/permessions.ts
// here we will implement the RBAC for managing roles and permessions
export const ROLES = {
  admin: [
    "view:departments",
    "create:departmens"
  ],
  student: [
    "view:departmens"
  ],
  teacher: [
    "view:departments"
  ]
} as const;
