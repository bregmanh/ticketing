import mongoose from 'mongoose'

interface TicketAttrs {
  title: string
  price: number
}

interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attr: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }
})