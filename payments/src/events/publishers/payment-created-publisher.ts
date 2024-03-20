import { Subjects, Publisher, PaymentCreatedEvent } from "@nzwillmorris/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
