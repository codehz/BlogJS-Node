// import Promise from 'bluebird'
// import jwt from 'koa-jwt'
// import {pick, omit} from 'lodash/fp'

import Blog from '../models/blog'

const blog = {
    list: async (ctx, next) => {
        ctx.body = await Blog.find({});
    }
}

export default blog;