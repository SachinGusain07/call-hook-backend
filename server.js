import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import fs from 'node:fs/promises'
import { connectDB } from './config/db.js'
import { errorMiddleware } from './src/utils/error.js'
import cookieParser from 'cookie-parser'
import allRoute from './src/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

// Global middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
)
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.text());

// Static files (uploaded payment screenshots)
app.use(
  '/uploads',
  express.static('uploads', {
    setHeaders(res) {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    },
  })
)


// Health check
app.get('/health', (_req, res) => {
  res.send({ status: 'ok', uptime: process.uptime() })
})

// API route
app.use("/api/v1" , allRoute)

app.get("/", (req, res) => {
  res.send("Hello from server ");
});


app.use(errorMiddleware);


// Start server after DB connects
async function start() {
  try {
    await fs.mkdir('uploads/payments', { recursive: true })
    await connectDB()
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running at http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message)
    process.exit(1)
  }
}

start()
