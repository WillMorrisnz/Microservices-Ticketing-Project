import { Publisher, OrderCancelledEvent, Subjects } from "@nzwillmorris/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
