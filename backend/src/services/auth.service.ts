/**
 * Service for authentication-related operations.
 */

import jwt from 'jsonwebtoken'
import { env } from '../config/env.ts';

const USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password'
  },
  {
    id: '2',
    email: 'user2@example.com',
    password: 'password2'
  }
]

export function signIn({email, password}: { email: string; password: string }) {
  const user = USERS.find(u => u.email === email);

  if (!user || password !== user.password) {
    return null
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email })
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

  return { 
    user: { 
      id: user.id, 
      email: user.email 
    },
    accessToken, 
    refreshToken 
  }
}

function generateAccessToken(user: { id: string; email: string }) {
  const secret = env.ACCESS_TOKEN_SECRET
  const ttl = Number(env.ACCESS_TOKEN_TTL)

  const accessToken = jwt.sign(
    user, 
    secret,
    { expiresIn: ttl }
  )

  return accessToken
}

function generateRefreshToken(user: { id: string; email: string }) {
  const secret = env.REFRESH_TOKEN_SECRET
  const ttl = Number(env.REFRESH_TOKEN_TTL)

  const refreshToken = jwt.sign(
    user,
    secret,
    { expiresIn: ttl }
  )

  return refreshToken
}

export function verifyAccessToken(token: string) {
  try {
    const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET)

    return { 
      valid: true as const, 
      payload 
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
      return { 
        valid: false as const, 
        expired: error instanceof jwt.TokenExpiredError 
      }
    }

    throw error
  }
}

function verifyRefreshToken(token: string) {
  const secret = env.REFRESH_TOKEN_SECRET

  try {
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (error) {
    return null
  }
}