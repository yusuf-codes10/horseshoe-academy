# classroom-management

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## testing

use these demo credentials to test the three different roles

```javascript
// seed.js
const users = [
  {
    name: "Admin",
    email: "admin@classroom.dev",
    role: "admin",
    password: "admin123",
  },
  {
    name: "Demo Teacher",
    email: "teacher@classroom.dev",
    role: "teacher",
    password: "teacher123",
  },
  {
    name: "Demo Student",
    email: "student@classroom.dev",
    role: "student",
    password: "student123",
  },
];
```
