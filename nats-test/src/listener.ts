import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listner connected to NATS");

  stan.on("close", () => {
    console.log("Nats conneciton closed");
    process.exit();
  });
  /** Enable this option for manual ack */
  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Recieved event #${msg.getSequence()} , with data: ${data}`);
    }
    /** Only require when manual ack mode is true to notify nats that it is sucessfully
     * processed otherwise it will continue to send same event.
     */
    msg.ack();
  });
});

/** Intercept terminate request to the program and then manually close the program
 * This will not work on windows since it generates a different event in windows
 */
process.on("SIGINT", () => stan.close());

process.on("SIGTERM", () => stan.close());
