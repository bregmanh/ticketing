import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.statusCode).not.toEqual(404)

})

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('returns a status code other than 401 when use is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({})
  expect(response.statusCode).not.toEqual(401)

})

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({ title: '', price: 10 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({ price: 10 })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({ title: 'title', price: -10 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({ title: 'title' })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const title = 'test title'
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({ title, price: 10 })

  expect(response.statusCode).toEqual(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].title).toEqual('test title')
  expect(tickets[0].price).toEqual(10)


})

