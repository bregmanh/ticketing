import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { NotFoundError } from './errors/not-found-error'
import { errorHandler } from './middlewares/error-handling'

const app = express()
// traffic being proxied though nginx. By default express wont trust proxied traffic over an HTTPS connection
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  // disable encryption for ease of different programming language support
  signed: false,
  // cookies only to be used overan HTTPS connection (security imrpvement)
  // if we're in a test env, set secure to false
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }