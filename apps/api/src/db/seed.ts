import { db } from '@/db/index';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';
import type { RegisterDTO } from '@classroom/shared';


const seed = async () => {
    console.log("🌱 Seeding database...");

      const hashedPassword = await bcrypt.hash("yourpassword123", 10)


    const admin: RegisterDTO = {
        fullName: "Your Name",
      username: "admin",
      email: "you@email.com",
      password: hashedPassword,
      gender: 'male',
      role: "admin",
    }
    await db.insert(users).values(admin)
}