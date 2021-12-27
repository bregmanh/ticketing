import { Subjects } from './subjects'

// setting coupling between subjects and structure of data
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated
  data: {
    id: string
    title: string
    price: number
  }
}