import { Publisher, Subjects, TicketUpdatedEvent } from '@ssorg/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
