import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'
import jwt from 'jsonwebtoken'

declare global {
  // Promise is going to resolve itself with a value of type aray of string
  var getAuthCookie: () => string[]
}

//global function to be available inside test environment
global.getAuthCookie = () => {
  // Build a JWT payload {id, email}
  const payload = {
    id: '12345',
    email: 'test@test.com'
  }
  const token = jwt.sign({
    payload
  }, process.env.JWT_KEY!)
  // Build a session object {jwt: MY_JWT}
  const session = { jwt: token }
  // Turn that session to JSON
  const sessionJSON = JSON.stringify(session)
  // Take JSON and encode it as a base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  // Return a string thats the cookie with the encoded data
  // The expectation is that cookies are in an array
  return [`express:sess=${base64}`]
}

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'dsfsdf'

  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  //reset all data before each test
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()

})