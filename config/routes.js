import jwt from 'koa-jwt'
import convert from 'koa-convert'
import router from 'koa-router'

import {jwtConf} from './config'

// import {isAdmin} from '../utils/permissions'
import users from '../app/controllers/users'
import blogs from '../app/controllers/blogs'

const opts = {prefix: '/api'}

const publicRouter = router(opts)
const privateRouter = router(opts)
const adminRouter = router(opts)

const getuser = async (ctx, next) => {
  try {
    const decoded = jwt.verify(ctx.headers.authorization, jwtConf.key)
    if (decoded.username !== undefined) {
      ctx.state.user = decoded
      await next()
    } else {
      ctx.throw({
        status: 401
      })
    }
  } catch (err) {
    ctx.throw(err, 401)
  }
}

privateRouter.use(getuser)
adminRouter.use(getuser, async (ctx, next) => {
  if (ctx.state.admin) return await next();
  ctx.throw('Operation not permitted', 403)
})

// ROUTER

// Users
publicRouter.post('/signup', users.signup)
publicRouter.post('/signin', users.signin)
publicRouter.get('/users/:username', users.get)
privateRouter.put('/users/update', users.update)

//Blogs
publicRouter.get('/blogs', blogs.list)
privateRouter.post('/blogs', blogs.create)
privateRouter.delete('/blogs/:blogname', blogs.deleteSelf)

// Admin permissions
// privateRouter.put('/users/update/:id', isAdmin, users.admin.update)

privateRouter.get('/private', async (ctx, next) => {
  ctx.body = {message: 'Private API'}
})

const protectRoutes = convert(jwt({
  secret: jwtConf.secret,
  passthrough: true
}))

export default [
  publicRouter.routes(),
  publicRouter.allowedMethods(),
  protectRoutes,
  privateRouter.routes(),
  privateRouter.allowedMethods()
]
