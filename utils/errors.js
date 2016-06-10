import {has} from 'lodash/fp'

export const catchErr = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log(err.toString())
    console.log(err.status)
    ctx.status = err.status || 500
    ctx.body = {
      message: err.toString()
    }
  }
}

const statusMsg = {
  403: 'Forbidden',
  404: 'Resource not found',
  405: 'Method not allowed',
  429: 'Too many requests.'
}

export const statusMessage = async (ctx, next) => {
  await next()

  if (has(ctx.status, statusMsg)) {
    const status = ctx.status
    ctx.body = {
      message: statusMsg[status]
    }
    ctx.status = status
  }
}
