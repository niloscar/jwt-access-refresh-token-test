/**
 * Service for authentication-related operations.
 */

import jwt from 'jsonwebtoken'

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

export function generateAccessToken(user: { id: string; email: string }) {
  const secret = process.env.ACCESS_TOKEN_SECRET
  const ttl = Number(process.env.ACCESS_TOKEN_TTL)

  if (!secret || !Number.isInteger(ttl) || ttl <= 0) {
    throw new Error('ACCESS_TOKEN_SECRET and ACCESS_TOKEN_TTL must be valid environment variables')
  }

  const accessToken = jwt.sign(
    user, 
    secret,
    { expiresIn: ttl }
  )

  return accessToken
}

export function generateRefreshToken(user: { id: string; email: string }) {
  const secret = process.env.REFRESH_TOKEN_SECRET
  const ttl = Number(process.env.REFRESH_TOKEN_TTL)

  if (!secret || !Number.isInteger(ttl) || ttl <= 0) {
    throw new Error('REFRESH_TOKEN_SECRET and REFRESH_TOKEN_TTL must be valid environment variables')
  }

  const refreshToken = jwt.sign(
    user,
    secret,
    { expiresIn: ttl }
  )

  return refreshToken
}