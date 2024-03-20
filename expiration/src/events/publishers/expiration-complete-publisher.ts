import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@nzwillmorris/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
