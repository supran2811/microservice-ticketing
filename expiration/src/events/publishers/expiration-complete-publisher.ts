import { Subjects, Publisher, ExpirationCompleteEvent } from '@ssorg/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
