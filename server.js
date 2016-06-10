import Koa from 'koa'
import logger from 'koa-logger'
import cors from 'koa-cors'
import compose from 'koa-compose'
import convert from 'koa-convert'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import limit from 'koa-better-ratelimit'

import db from './config/database'
import config from './config/config'
import routes from './config/routes'
import {catchErr, statusMessage} from './utils/errors'

const app = module.exports = new Koa()
app.context.conf = config

app.use(catchErr)

if (config.appConf.env === 'dev') {
  app.use(logger())
}

app.use(compose([logger(), compress(), bodyParser()]))
app.use(convert(cors(config.cors)))
app.use(convert(limit(config.rateLimit)))

app.use(statusMessage)
app.use(compose(routes))

db.on('connected', () => {
  if (!module.parent) {
    const port = process.env.PORT || 3000
    app.listen(port, console.log(`listening on port ${port}`))
  }
})
