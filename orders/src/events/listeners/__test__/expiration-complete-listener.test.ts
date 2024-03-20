import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent } from "@nzwillmorris/common";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderStatus } from "@nzwillmorris/common";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
  });
  await ticket.save();

  // create an order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "reee",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore since we only want to fake 1 function on message
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, message };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, data, message } = await setup();
  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled event", async () => {
  const { listener, order, data, message } = await setup();
  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  expect(
    JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]).id
  ).toEqual(order.id);
});

it("ack's the message", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
