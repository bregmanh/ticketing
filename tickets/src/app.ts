import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { NotFoundError, errorHandler, currentUser, requireAuth } from '@hbticketing/common'
import { createTicketRouter } from './routes/new'

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

//require authentication
app.use(currentUser)
app.use(createTicketRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }