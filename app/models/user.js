import mongoose, {Schema} from 'mongoose'
import Promise from 'bluebird'
import uniqueValidator from 'mongoose-unique-validator'
import timestamp from 'mongoose-timestamp'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  }
})

userSchema.plugin(uniqueValidator)
userSchema.plugin(timestamp)

userSchema.pre('save', async function (next) {
  bcrypt.hash(this.password, 10, (err, h) => {
    if (err) console.log(err)
    this.password = h
    next()
  })
})

userSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update.password) {
    bcrypt.hash(this._update.password, 10, (err, h) => {
      if (err) console.log(err)
      this._update.password = h
      next()
    })
  }
  next()
})

const model = mongoose.model('User', userSchema)
Promise.promisifyAll(model)
Promise.promisifyAll(model.prototype)

export default model
