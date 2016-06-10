import mongoose, {Schema} from 'mongoose'
import Promise from 'bluebird'
import uniqueValidator from 'mongoose-unique-validator'
import timestamp from 'mongoose-timestamp'

const blogSchema = new Schema({
  blogname: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  }
})

blogSchema.plugin(uniqueValidator)
blogSchema.plugin(timestamp)

const model = mongoose.model('Blog', blogSchema)
Promise.promisifyAll(model)
Promise.promisifyAll(model.prototype)

export default model