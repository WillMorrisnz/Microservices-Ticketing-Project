import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "A valid title",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "A valid title",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "Ticket Title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "Edited Ticket Title", price: 1000 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const userCookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", userCookie)
    .send({ title: "Ticket Title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({ title: "Ticket Title", price: -10 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const userCookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", userCookie)
    .send({ title: "Ticket Title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({ title: "Edited Title", price: 30 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual("Edited Title");
  expect(ticketResponse.body.price).toEqual(30);
});

it("publishes an event", async () => {
  const userCookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", userCookie)
    .send({ title: "Ticket Title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({ title: "Edited Title", price: 30 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const userCookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", userCookie)
    .send({ title: "Ticket Title", price: 20 });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({ title: "Edited Title", price: 30 })
    .expect(400);
});
