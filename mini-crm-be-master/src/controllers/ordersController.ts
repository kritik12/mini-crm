import redis from "../config/redisClient";
import { Request, Response } from "express";
import { findCustomerByMobile } from "../services/orderHandler";

// Controller function to add a new event
export const addEvent = async (req: Request, res: Response) => {
  const {
    customerId,
    customerName,
    customerEmail,
    mobileNumber,
    purchaseAmount,
    purchaseDate,
  } = req.body;

  // Validate input
  if (
    customerId === undefined ||
    purchaseAmount === undefined ||
    customerName === undefined ||
    customerEmail === undefined ||
    mobileNumber === undefined ||
    purchaseDate === undefined
  ) {
    return res
      .status(400)
      .send({ message: "complete customer credentials are required" });
  }

  const eventPayload = {
    customerId,
    customerName,
    customerEmail,
    mobileNumber,
    purchaseAmount,
    purchaseDate,
  };

  try {
    await redis.publish("NEW_ORDER", JSON.stringify(eventPayload));
    res.status(201).send({ message: "Event published", event: eventPayload });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error publishing event" });
  }
};

// Controller to handle customer-related requests
export const customerController = {
  // Method to find a customer by email
  getCustomerByMobile: async (req: Request, res: Response): Promise<void> => {
    const { mobileNumber } = req.params; // Extract email from request parameters

    try {
      const customerDetails = await findCustomerByMobile(BigInt(mobileNumber)); // Call the service function

      if (customerDetails) {
        res.status(200).json(customerDetails); // Send response without returning
      } else {
        res.status(404).json({ message: "Customer not found" }); // Send 404 if not found
      }
    } catch (error) {
      console.error("Error retrieving customer:", error);
      res.status(500).json({ message: "Internal server error" }); // Send 500 for server errors
    }
  },
};
