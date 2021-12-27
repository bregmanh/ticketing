import { Message, Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
  subject: Subjects
  data: any
}
// generic class. T can be though of as an argument that can access properties of Event interface
export abstract class Listener<T extends Event> {
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract onMessage(data: T['data'], msg: Message): void
  private client: Stan
  protected ackWait = 5 * 1000

  constructor(client: Stan) {
    this.client = client
  }
  // options to subscription call. Setting options is done by chaining
  // setting manual ack mode to true to acknowledge successful processing of an event
  // if ack not recieved within 5s NATS is going to send that event to another memeber of the QueueGroup or same service again
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      // will make sure that the very first time the subscription is created it will recieve all events.
      // however when the service simply restarts, the events marked as already delievered in durable subscription will not be delivered again
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
  }

  listen() {
    const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions())
    subscription.on('message', (msg: Message) => {
      `Message recieved: ${this.subject} / ${this.queueGroupName}`
      const parsedData = this.parseMessage(msg)
      this.onMessage(parsedData, msg)
    })
  }

  parseMessage(msg: Message) {
    const data = msg.getData()
    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'))
  }
}
