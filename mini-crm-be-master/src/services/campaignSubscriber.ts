import { redisSubscriber } from "../config/redisClient"; // Subscriber client
import { insertCampaign } from "./campaignHandler";

// Function to subscribe to a Redis channel and insert campaigns
(function subscribeToCampaignChannel() {
  const channel = "NEW_CAMPAIGN"; // Specify the channel name

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
      const campaignData = JSON.parse(message);
      const {
        segmentId,
        audienceSize,
        message: campaignMessage,
      } = campaignData;
      // Call the insertCampaign function with the data from the message
      const campaignId = await insertCampaign(
        segmentId,
        audienceSize,
        campaignMessage
      );
      console.log(`Campaign inserted with ID: ${campaignId}`);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });
})();
