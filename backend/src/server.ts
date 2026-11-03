import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import { env } from './config/env.ts'

import authRouter from './routes/auth.router.ts'

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`))