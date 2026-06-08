const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')
const auth = require('./middleware/auth')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/private/ping', auth, (req, res) => {
  res.json({ ok: true, uid: req.user.uid })
})

// Wave 2 — Luis Téllez
app.use('/api/feed',  require('./routes/feed'))
app.use('/api/swipe', require('./routes/swipe'))

// Wave 2 — Héctor Morales
const contentRoutePath = path.join(__dirname, 'routes', 'content.js')
if (fs.existsSync(contentRoutePath)) {
  app.use('/api/content', require('./routes/content'))
}

const port = Number(process.env.PORT || 3001)
app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`)
})
