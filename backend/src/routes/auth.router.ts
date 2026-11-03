import { Router } from 'express'
import { Request, Response } from 'express'

const router = Router()

const USER = {
  id: '1',
  email: 'user@example.com',
  password: 'password'
}

router.post('/sign-in', (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  if (email === USER.email && password === USER.password) {
    // ONTODO: Implement sign-in logic (e.g., set session, cookies, etc.)

    return res.json({ message: 'Sign in successful', user: { id: USER.id, email: USER.email } })
  } else {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
})

router.post('/sign-out', (req: Request, res: Response) => {
  // ONTODO: Implement sign-out logic (e.g., clear session, cookies, etc.)
  res.json({ message: 'Sign out successful' })
})

router.get('/protected', (req: Request, res: Response) => {
  // ONTODO: Implement access control logic (e.g., check session, cookies, etc.)

  res.json({ message: 'Access granted to protected page' })
})

router.get('/refresh', (req: Request, res: Response) => {
  // ONTODO: Implement refresh logic (e.g., refresh tokens, update session, etc.)

  res.json({ message: 'Refresh successful' })
})

export default router