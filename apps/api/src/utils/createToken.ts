// utils/createToken.ts
import { sign } from 'hono/jwt'
import type { User } from '@classroom/shared';

export const createToken = async (user: User) => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')

  return sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days, matches your cookie maxAge
    },
    secret
  )
}