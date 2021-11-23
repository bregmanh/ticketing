import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handling'
import { NotFoundError } from './errors/not-found-error'
import { User } from './models/user'

const app = express()
// traffic being proxied though nginx. By default express wont trust proxied traffic over an HTTPS connection
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  // disable encryption for ease of different programming language support
  signed: false,
  // cookies only to be used overan HTTPS connection (security imrpvement)
  secure: true
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('connected to mongo db')
  } catch (err) {
    console.log(err)
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!')
  })
}

start()

