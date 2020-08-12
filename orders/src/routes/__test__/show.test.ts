import request from 'supertest';
// import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';

it('fetches the order', async () => {
  /// Create a ticket
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });

  await ticket.save();

  /// Create order with ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another user order', async () => {
  /// Create a ticket
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });

  await ticket.save();

  /// Create order with ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
