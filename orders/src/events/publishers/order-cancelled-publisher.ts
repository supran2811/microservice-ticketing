import { Publisher, OrderCancelledEvent, Subjects } from '@ssorg/common';

export class OrderCancelledPubliser extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
