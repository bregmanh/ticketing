import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get(
  '/api/tickets',
  async (req: Request, res: Response) => {
    // empty object inside means no filters (object is used for filtering)
    const tickets = await Ticket.find({})
    res.status(200).send(tickets)
  }
)

export { router as indexTicketRouter }
