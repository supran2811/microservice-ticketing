import { Publisher, OrderCreatedEvent, Subjects } from '@ssorg/common';

export class OrderCreatedPubliser extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
