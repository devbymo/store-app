import express, { Application } from 'express'
import * as dotenv from 'dotenv'
import routes from './routes/index'
import routeNotFound from './middlewares/routeNotFound'
import error from './middlewares/error'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import path from 'path'

dotenv.config()

const app: Application = express()

// Body parser
app.use(express.json())

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// HTTP security headers
app.use(helmet())

// Request limit
const limiter = rateLimit({
  windowMs:
    typeof process.env.REQEST_LIMIT_TIMEOUT === 'string'
      ? parseInt(process.env.REQEST_LIMIT_TIMEOUT)
      : 15 * 60 * 1000, // 15 minutes
  max:
    typeof process.env.REQEST_NUMBER_LIMIT === 'string'
      ? parseInt(process.env.REQEST_NUMBER_LIMIT)
      : 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later',
})
app.use(limiter)

// Routes
app.use('/api', routes)

// Route not found
app.use(routeNotFound)

// Error handler (Generic)
app.use(error)

export default app
