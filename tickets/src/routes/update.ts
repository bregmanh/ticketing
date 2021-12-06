import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@hbticketing/common'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
      throw new NotFoundError()
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    //sets the changes in memory
    ticket.set({
      title: req.body.title,
      price: req.body.price
    })
    //to presist the changes 
    await ticket.save()

    res.send(ticket)
  }
)

export { router as updateTicketRouter }
