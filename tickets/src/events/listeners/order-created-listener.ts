import { Message } from 'node-nats-streaming';

import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { Ticket } from '../../models/ticket';
import { Listener, OrderCreatedEvent, Subjects } from '@ssorg/common';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket which order is reservice
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket then throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // Mark the ticket as reserved by setting its order id
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();
    // ack the message

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
