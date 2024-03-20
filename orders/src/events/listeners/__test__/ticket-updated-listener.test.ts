import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@nzwillmorris/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
  });
  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "edited concert",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore since we only want to fake 1 function on message
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, message };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, ticket, message } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, message);

  // write assertions to make sure a ticket was created!
  const fetchedTicket = await Ticket.findById(ticket.id);

  expect(fetchedTicket!.title).toEqual(data.title);
  expect(fetchedTicket!.price).toEqual(data.price);
  expect(fetchedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, message } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, message);

  // write assertions to make sure ack function was called
  expect(message.ack).toHaveBeenCalled();
});

it("does not ack the message when events are out of order", async () => {
  const { listener, data, message } = await setup();
  // call the onMessage function with the data object + message object
  data.version = 10;

  try {
    await listener.onMessage(data, message);
  } catch (err) {}

  // write assertions to make sure ack function was called
  expect(message.ack).not.toHaveBeenCalled();
});
