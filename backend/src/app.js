const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
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

const port = Number(process.env.PORT || 3001)
app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`)
})
