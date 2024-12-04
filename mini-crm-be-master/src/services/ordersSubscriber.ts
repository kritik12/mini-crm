import { redisSubscriber } from "../config/redisClient"; // Subscriber client
import { insertOrder } from "./orderHandler";

// Function to subscribe to a Redis channel and insert orders
(function subscribeToOrderChannel() {
  const channel = "NEW_ORDER";

  // Subscribe to the Redis channel
  redisSubscriber.subscribe(channel, (err, count) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(
        `Subscribed to ${count} channel(s). Listening for messages on "${channel}".`
      );
    }
  });

  // Set up a listener for messages on the channel
  redisSubscriber.on("message", async (recievedChannel, message) => {
    if (recievedChannel !== channel) {
      return;
    }
    console.log(`Received message from ${recievedChannel}:`, message);

    try {
      // Parse the message as JSON (assuming the message is sent as a JSON string)
      const orderData = JSON.parse(message);
      const {
        customerId,
        customerName,
        customerEmail,
        mobileNumber,
        purchaseAmount,
        purchaseDate,
      } = orderData;

      // Call the insertOrder function with the data from the message
      const orderId = await insertOrder(
        customerId,
        customerName,
        customerEmail,
        mobileNumber,
        purchaseAmount,
        purchaseDate
      );
      console.log(`Order inserted with ID: ${orderId}`);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });
})();
