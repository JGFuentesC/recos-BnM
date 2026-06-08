const admin = require('../firebase/admin')

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'missing_token' })
    }

    const idToken = authHeader.slice(7)
    const decoded = await admin.auth().verifyIdToken(idToken)

    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
    }

    return next()
  } catch (error) {
    return res.status(401).json({ error: 'invalid_token' })
  }
}
