import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

const createTicket = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({ title, price })
    .expect(201)
}

it('can fetch a list of tickets', async () => {
  await createTicket('title1', 10)
  await createTicket('title2', 20)
  await createTicket('title3', 30)

  const response = await request(app)
    .get(`/api/tickets`)
    .send()
    .expect(200)

  expect(response.body.length).toEqual(3)

})