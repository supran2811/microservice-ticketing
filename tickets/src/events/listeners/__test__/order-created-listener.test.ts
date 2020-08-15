import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@ssorg/common';
import { Message } from 'node-nats-streaming';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Created an instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket

  const ticket = Ticket.build({
    title: 'sfdsfs',
    price: 20,
    userId: 'sffg',
  });

  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'sdfsfssgs',
    expiresAt: 'sdfs',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create a message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, msg, ticket };
};

it('sets the userid of the ticket', async () => {
  const { data, listener, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { data, listener, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
