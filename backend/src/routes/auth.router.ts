/**
 * Routes for authentication-related endpoints.
 */

import { Router } from 'express'
import * as controller from '../controllers/auth.controller.ts'

const router = Router()

router.post('/sign-in', controller.signIn)
router.post('/sign-out', controller.signOut)
router.get('/protected', controller.getProtectedPage)
router.post('/refresh', controller.refreshToken)

export default router