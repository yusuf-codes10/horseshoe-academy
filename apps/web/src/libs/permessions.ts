// src/libs/permessions.ts
// here we will implement the RBAC for managing roles and permessions
export type Role = keyof typeof ROLES;
import type { NewUser} from '@classroom/shared';

type Permession = (typeof ROLES)[Role][number] //getting the values this time not the keys

type P = "view:departments" | "create:departmens" | "view:departmens"

export const ROLES = {
  admin: [
    "view:departments",
    "create:departments"
  ],
  student: [
    "view:departments"
  ],
  teacher: [
    "view:departments"
  ]
} as const;

export const hasPermession = (user: NewUser, permession: Permession) => {

}
