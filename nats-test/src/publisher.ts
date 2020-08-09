import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher is connected to nats");
  try {
    await new TicketCreatedPublisher(stan).publish({
      id: "123",
      title: "Concert",
      price: 20,
    });
  } catch (error) {
    console.log(error);
  }
});
