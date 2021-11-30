import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@hbticketing/common'
import { body } from 'express-validator'

const router = express.Router()

router.post('/api/tickets', requireAuth, [
  body('title')
    // not is empty covers both title is not provided at all, or an empty string
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    // price must be decimal and gt (greater than) 0
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
], validateRequest, (req: Request, res: Response) => {

  res.sendStatus(200)
})

export { router as createTicketRouter }