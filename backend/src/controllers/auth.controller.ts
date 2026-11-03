/**
 * Controller for authentication-related routes.
 */

import * as service from '../services/auth.service.ts'
import type { Request, Response, CookieOptions } from 'express'

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: false,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
}

export function signIn(req: Request, res: Response) {
  const { email, password } = req.body

  // ONTODO: Validate email and password better
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const data = service.signIn({ email, password })

  if (!data) return res.status(401).json({ message: 'Invalid email or password' })

  const { user, accessToken, refreshToken } = data

  const accessTokenCookieOptions = {
    ...COOKIE_OPTIONS,
    maxAge: Number(process.env.ACCESS_TOKEN_TTL) * 1000,
  }

  res.cookie(
    'access_token',
    accessToken,
    accessTokenCookieOptions
  )

  const refreshTokenCookieOptions = {
    ...COOKIE_OPTIONS,
    path: '/auth/refresh',
    maxAge: Number(process.env.REFRESH_TOKEN_TTL) * 1000,
  }

  res.cookie(
    'refresh_token', 
    refreshToken, 
    refreshTokenCookieOptions
  )

  res.json({ message: 'Sign in successful', user })
}

export function signOut(req: Request, res: Response) {
  // ONTODO: Implement sign-out logic
  // Remove access token
  // Remove refresh token

  res.json({ message: 'Sign out successful' })
}

export function getProtectedPage(req: Request, res: Response) {
  // ONTODO: Check if the user is authenticated
  // Verify the access token

  res.json({ message: 'Access granted to protected page' })
}

export function refreshToken(req: Request, res: Response) {
  // ONTODO: Implement refresh logic
  // Verify the refresh token
  // Generate a new access token
  const newAccessToken = 'new-access-token-placeholder'

  res.json({ message: 'Refresh successful', accessToken: newAccessToken })
}