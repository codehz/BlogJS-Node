export const appConf = {
  port: process.env.PORT || 3000,
  env: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
    ? 'dev'
    : 'prod'
}

export const jwtConf = {
  key: process.env.JWT_KEY || 'key',
  secret: process.env.JWT_SECRET || 'secret',
  expiresIn: '1d',
  alg: 'HS256'
}
const dbName = process.env.NODE_ENV === 'test' ? 'db-test' : 'blogjs-db'
export const db = {
  host: '127.0.0.1',
  port: 27017,
  name: dbName,
  user: '',
  pass: ''
}

const max = process.env.NODE_ENV === 'test' ? 100000 : 10
export const rateLimit = {
  max: process.env.RATE_LIMIT || max,
  duration: process.env.RATE_LIMIT_DUR || 10000
}

export const cors = {
  origin: true
}

export default {jwtConf, db, rateLimit, appConf, cors}
