export const isAdmin = async (ctx, next) => {
  if (ctx.state.user.admin) {
    await next()
  } else {
    ctx.throw({status: 401})
  }
}
