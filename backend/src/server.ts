import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { env } from './config/env.ts'

import authRouter from './routes/auth.router.ts'

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`)
})