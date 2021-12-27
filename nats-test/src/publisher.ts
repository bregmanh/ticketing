import nats from 'node-nats-streaming'

console.clear()

// stan is an instance (or client) to connect to nats streaming server
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

// when client successfully connects it emits a connect event, for which we are listening here
stan.on('connect', () => {
  console.log('Publisher connected to NATS')

  //information we want to share. has to be JSON stirng
  const data = JSON.stringify({
    id: '123',
    title: 'connect',
    price: 20
  })

  // 3 arguments: channel name, data and optional callback
  stan.publish('ticket:created', data, () => {
    console.log('event published')
  })
})