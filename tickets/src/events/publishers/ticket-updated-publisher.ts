import { Publisher, Subjects, TicketUpdatedEvent } from "@nzwillmorris/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
