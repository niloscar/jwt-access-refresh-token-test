import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../services/auth.service.ts'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token

  if (typeof token !== 'string' || !token) {
    res.status(401).json({ message: 'Missing access token' })
    return
  }

  const result = verifyAccessToken(token)

  if (!result.valid) {
    res.status(401).json({
      message: result.expired
        ? 'Access token expired'
        : 'Not signed in',
    })
    return
  }

  next()
}