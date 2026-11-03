/**
 * Controller for authentication-related routes.
 */

import { env } from '../config/env.ts'
import * as service from '../services/auth.service.ts'
import type { Request, Response, CookieOptions } from 'express'

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production',
}

const REFRESH_PATH = '/api/auth/refresh'

export function signIn(req: Request, res: Response) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const data = service.signIn({ email, password })

  if (!data) return res.status(401).json({ message: 'Invalid email or password' })

  const { user, accessToken, refreshToken } = data

  const accessTokenCookieOptions = {
    ...COOKIE_OPTIONS,
    maxAge: Number(env.ACCESS_TOKEN_TTL) * 1000,
  }

  res.cookie(
    'access_token',
    accessToken,
    accessTokenCookieOptions
  )

  const refreshTokenCookieOptions = {
    ...COOKIE_OPTIONS,
    path: REFRESH_PATH,
    maxAge: Number(env.REFRESH_TOKEN_TTL) * 1000,
  }

  res.cookie(
    'refresh_token', 
    refreshToken, 
    refreshTokenCookieOptions
  )

  res.json({ message: 'Sign in successful', user })
}

export function signOut(_req: Request, res: Response) {
  res.clearCookie('access_token', COOKIE_OPTIONS)
  res.clearCookie('refresh_token', {...COOKIE_OPTIONS, path: REFRESH_PATH})

  res.json({ message: 'Sign out successful' })
}

export function getProtectedPage(_req: Request, res: Response) {
  res.json({ message: 'Access granted to protected page' })
}

export function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.refresh_token

  if (typeof token !== 'string' || !token) {
    return res.status(401).json({ message: 'Missing refresh token' })
  }

  const result = service.verifyRefreshToken(token)

  if (!result.valid) {
    return res.status(401).json({
      message: result.expired
        ? 'Refresh token expired'
        : 'Invalid refresh token'
    })
  }

  const { payload } = result

  if (typeof payload === 'string' || typeof payload.id !== 'string' || typeof payload.email !== 'string') {
    return res.status(401).json({ message: 'Invalid token payload' })
  }

  const accessToken = service.generateAccessToken({
    id: payload.id,
    email: payload.email
  })

  const accessTokenCookieOptions = {
    ...COOKIE_OPTIONS,
    maxAge: Number(env.ACCESS_TOKEN_TTL) * 1000,
  }

  res.cookie(
    'access_token', 
    accessToken, 
    accessTokenCookieOptions
  )

  return res.json({ message: 'Access token refreshed' })
}