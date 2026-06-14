const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') })
dotenv.config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const auth = require('./middleware/auth')
const app = express()

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: {
    policy: 'same-origin-allow-popups',
  },
}))

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',')
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('CORS'))
  },
  credentials: true,
}))

app.use(express.json({ limit: '10kb' }))

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
}))

app.use('/api/swipe', rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}))

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/health', auth, (req, res) => {
  res.json({ ok: true, uid: req.user.uid, email: req.user.email })
})

app.use('/api', auth)

app.get('/api/private/ping', auth, (req, res) => {
  res.json({ ok: true, uid: req.user.uid })
})

// Wave 2 — Luis Téllez
app.use('/api/feed',  require('./routes/feed'))
app.use('/api/swipe', require('./routes/swipe'))
app.use('/api/search', require('./routes/search'))

// Wave 2 — Héctor Morales
app.use('/api/content', require('./routes/content'))

// Wave 2 — Christian Ruiz
app.use('/api/collections', require('./routes/collections'))

// Serve frontend build — SPA fallback
const frontendDist = path.resolve(__dirname, '../../frontend/dist')
app.use(express.static(frontendDist))
app.use((req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 3001)
app.listen(port, host, () => {
  console.log(`[backend] listening on http://${host}:${port}`)
})
