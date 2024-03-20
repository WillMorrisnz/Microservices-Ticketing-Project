import { Publisher, Subjects, TicketCreatedEvent } from "@nzwillmorris/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
