import redis from "../config/redisClient";
import { Request, Response } from "express";
import {
  fetchAllCampaigns,
  getCampaignStatsById,
  getDeliveryReceipt,
} from "../services/campaignHandler";

// Controller function to add a new campaign
export const addCampaign = async (req: Request, res: Response) => {
  const { segmentId, audienceSize, message } = req.body;

  // Validate input
  if (
    segmentId === undefined ||
    audienceSize === undefined ||
    message === undefined
  ) {
    return res
      .status(400)
      .send({ message: "Segment ID, audience size, and message are required" });
  }

  const campaignPayload = {
    segmentId,
    audienceSize,
    message,
  };

  try {
    // Publish the campaign details to the Redis channel
    await redis.publish("NEW_CAMPAIGN", JSON.stringify(campaignPayload));
    res
      .status(201)
      .send({ message: "Campaign published", campaign: campaignPayload });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error publishing campaign" });
  }
};
// Controller function to fetch all campaigns
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await fetchAllCampaigns(); // Call the handler function to get campaigns
    res.status(200).send(campaigns); // Send the campaigns as the response
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching campaigns" });
  }
};

// Controller function to handle the request for campaign stats

export const campaignStatsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { campaignId } = req.params; // Extract campaign ID from request parameters

  try {
    const campaignStats = await getCampaignStatsById(campaignId); // Call the function to get stats

    res.status(200).json(campaignStats);
  } catch (error) {
    console.error("Error in campaignStatsController:", error);

    res.status(500).json({
      message: "An error occurred while fetching campaign statistics.",
    });
  }
};

// Controller function to handle fetching delivery receipts
export const deliveryReceiptController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { campaignId, mobileNumber } = req.body; // Extract campaignId and userId from request body

  // Validate that both campaignId and userId are provided
  if (!campaignId || !mobileNumber) {
    res.status(400).json({
      message:
        "Both campaignId and mobileNumber are required in the request body.",
    });
    return;
  }

  try {
    // Call the function to get the delivery receipt
    const receipt = await getDeliveryReceipt(
      Number(campaignId),
      mobileNumber as bigint
    );

    // Send the receipt back as JSON
    res.status(200).json(receipt);
  } catch (error) {
    console.error("Error in deliveryReceiptController:", error);

    // Type assertion to access the message property
    const errorMessage = (error as Error).message;

    // Check if the error is a specific known error or a generic one
    if (errorMessage === "Delivery receipt not found") {
      res.status(404).json({ message: "Delivery receipt not found" });
    } else {
      res.status(500).json({
        message: "An error occurred while fetching the delivery receipt.",
      });
    }
  }
};
