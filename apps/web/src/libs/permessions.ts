// src/libs/permessions.ts
// here we will implement the RBAC for managing roles and permessions
export type Role = keyof typeof ROLES;
import type { NewUser} from '@classroom/shared';

export type Permession = (typeof ROLES)[Role][number] //getting the values this time not the keys

// a fancy way to write this is to use Indexed Access Types in TypeScript
// type P = "view:departments" | "create:departmens" | "view:departmens"

export const ROLES = {
  admin: [
    "view:departments",
    "create:departments",
    "create:subjects",
    "view:subjects",
    "view:classes",
    "create:classes",
    "view:sessions",
  ],
  student: [
    "view:classes"
  ],
  teacher: [
    "view:classes",
    "view:sessions",
    "create:sessions"
  ]
} as const;

export const hasPermession = (user: NewUser, permession: Permession) => {
  const permissions = ROLES[user.role]
  if (!permissions) return false
  return (ROLES[user.role] as readonly Permession[]).includes(permession)
}
