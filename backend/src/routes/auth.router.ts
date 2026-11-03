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
    return res.json({ message: 'Sign in successful', user: { id: USER.id, email: USER.email } })
  } else {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
})

router.post('/sign-out', (req: Request, res: Response) => {
  // Simulate a successful sign-out response
  res.json({ message: 'Sign out successful' })
})

router.get('/protected', (req: Request, res: Response) => {
  // Simulate a protected page response
  res.json({ message: 'Access granted to protected page' })
})

router.get('/refresh', (req: Request, res: Response) => {
  // Simulate a refresh response
  res.json({ message: 'Refresh successful' })
})

export default router