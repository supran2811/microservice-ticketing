import { Publisher, Subjects, TicketCreatedEvent } from '@ssorg/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
