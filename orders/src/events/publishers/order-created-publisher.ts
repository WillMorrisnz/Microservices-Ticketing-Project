import { Publisher, OrderCreatedEvent, Subjects } from "@nzwillmorris/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
