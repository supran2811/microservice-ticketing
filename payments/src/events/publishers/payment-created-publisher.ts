import { PaymentCreatedEvent, Publisher, Subjects } from '@ssorg/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
