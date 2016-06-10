import Promise from 'bluebird'
import bcrypt from 'bcrypt'
import jwt from 'koa-jwt'
import {pick, omit} from 'lodash/fp'

import User from '../models/user'
import {jwtConf} from '../../config/config'
const {key, alg, expiresIn} = jwtConf

const compareAsync = Promise.promisify(bcrypt.compare)

const users = {
  signup: async (ctx, next) => {
    try {
      ctx.body = await User.createAsync(ctx.request.body)
    } catch (err) {
      err.status = 400
      ctx.throw(err)
    }

    ctx.status = 201
  },

  signin: async (ctx, next) => {
    const {username, password} = ctx.request.body
    try {
      const user = await User.findOne({username})

      if (user) {
        ctx.body = user
        if (await compareAsync(password, user.password)) {
          ctx.state.user = user
        } else {
          ctx.throw({status: 401})
        }
      } else {
        ctx.throw({status: 404})
      }
    } catch (err) {
      ctx.throw(err)
    }

    ctx.body = {
      token: jwt.sign(
        pick(['_id', 'username', 'admin'], ctx.state.user),
        key,
        {
          expiresIn: expiresIn,
          algorithm: alg
        }
      )
    }
  },

  get: async (ctx, next) => {
    try {
      ctx.body = await User.findOne(
        {username: ctx.params.username},
        'username createdAt updatedAt admin'
      )

      if (!ctx.body) {
        ctx.status = 404
      }
    } catch (err) {
      ctx.throw(err)
    }
  },

  update: async (ctx, next) => {
    try {
      ctx.body = await User.findOneAndUpdateAsync(
        {_id: ctx.state.user._id},
        omit(['admin'], ctx.request.body),
        {new: true}
      )
    } catch (err) {
      ctx.throw(err)
    }
  }
}

export default users
