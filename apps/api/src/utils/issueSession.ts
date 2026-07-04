import type { Context } from 'hono'
import type { User } from '@classroom/shared'
import { createToken } from './createToken'
import { signToken } from './signToken'

export const issueSession = async (
  c: Context,
  user: Pick<User, 'id' | 'username' | 'email'>
) => {
  const token = await createToken(user)
  signToken(c, token)
}