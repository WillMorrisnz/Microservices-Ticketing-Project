import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@nzwillmorris/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore since we only want to fake 1 function on message
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("creates and saves a ticket", async () => {
  const { listener, data, message } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, message);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, message } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, message);

  // write assertions to make sure ack function was called
  expect(message.ack).toHaveBeenCalled();
});
