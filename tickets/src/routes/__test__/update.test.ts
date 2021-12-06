import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

it('return a 404 if the provided id does not exist', async () => {
  //generating a random mongoose valid id (ObjectId)
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', getAuthCookie())
    .send({
      title: 'fdgdfg', price: 10
    })
    .expect(404)
})

it('return a 401 (forbidden) if the user is not authenicated', async () => {
  //generating a random mongoose valid id (ObjectId)
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'fdgdfg', price: 10
    })
    .expect(401)
})

it('return a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', getAuthCookie())
    .send({ title: 'title', price: 10 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', getAuthCookie())
    .send({ title: 'title update', price: 1000 })
    .expect(401)
})

it('return a 400 if the user provices an invalid title or price', async () => {
  const cookie = getAuthCookie()
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 1000 })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: -10 })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'fdsfds' })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const cookie = getAuthCookie()
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updated title', price: 1000 })
    .expect(200)

  const updatedTicket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(updatedTicket.body.title).toEqual('updated title')
  expect(updatedTicket.body.price).toEqual(1000)

})