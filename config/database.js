import mongoose from 'mongoose'

import {db} from './config'

const onConnected = () => console.log('mongo connection open')
const onDisconnected = () => console.error('mongo disconnected')
const onError = err => { throw err }

mongoose.connect(`mongodb://${db.host}:${db.port}/${db.name}`)

mongoose.connection.on('error', onError)
mongoose.connection.on('connected', onConnected)
mongoose.connection.on('disconnected', onDisconnected)

// ^C / kill -SIGINT
process.on('SIGINT', () =>
  mongoose.connection.close(() =>
    process.exit(
      0, console.log('mongo connection disconnected through app termination')
    )
  )
)

export default mongoose.connection
