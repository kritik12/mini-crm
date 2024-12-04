import { Request, Response } from "express";
import { RequestHandler } from "express";
import {
  insertSegment,
  getAllSegments,
  getSegmentById,
  updateSegment,
  deleteSegment,
  SegmentDetails,
  calculateAudienceSize,
} from "../services/segmentHandler";

//functions for segment controller
export const segmentController = {
  // Method to create a new segment
  createSegment: async (req: Request, res: Response) => {
    const {
      segmentName,
      lowPar,
      highPar,
      leastVisits,
      mostVisits,
      lastVisitDays,
    }: Omit<SegmentDetails, "id"> = req.body; // Use the SegmentDetails interface for type safety

    // Validate input
    if (
      !segmentName ||
      lowPar === undefined ||
      highPar === undefined ||
      leastVisits === undefined ||
      mostVisits === undefined ||
      lastVisitDays === undefined
    ) {
      return res
        .status(400)
        .send({ message: "Complete segment data is required" });
    }

    const segmentData: Omit<SegmentDetails, "id"> = {
      segmentName,
      lowPar,
      highPar,
      leastVisits,
      mostVisits,
      lastVisitDays,
    };

    try {
      const segmentId = await insertSegment(segmentData);
      res.status(201).send({ message: "Segment created", segmentId });
    } catch (error) {
      console.error("Error creating segment:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  // Method to get all segments
  getSegments: async (req: Request, res: Response) => {
    try {
      const segments = await getAllSegments();
      res.status(200).json(segments);
    } catch (error) {
      console.error("Error retrieving segments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Method to get a segment by ID
  getSegment: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Segment ID is required" });
    }

    try {
      const segment = await getSegmentById(Number(id));

      if (segment) {
        res.status(200).json(segment);
      } else {
        res.status(404).json({ message: "Segment not found" });
      }
    } catch (error) {
      console.error("Error retrieving segment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateSegment: async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      segmentName,
      lowPar,
      highPar,
      leastVisits,
      mostVisits,
      lastVisitDays,
    }: SegmentDetails = req.body;

    // Validate required fields
    if (
      !id ||
      !segmentName ||
      lowPar === undefined ||
      highPar === undefined ||
      leastVisits === undefined ||
      mostVisits === undefined ||
      lastVisitDays === undefined
    ) {
      return res.status(400).send({ message: "All fields are required" });
    }

    try {
      await updateSegment(Number(id), {
        segmentName,
        lowPar,
        highPar,
        leastVisits,
        mostVisits,
        lastVisitDays,
      });
      res.status(200).send({ message: "Segment updated successfully" });
    } catch (error) {
      console.error("Error updating segment:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  // Method to delete a segment
  deleteSegment: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await deleteSegment(Number(id));
      res.status(200).send({ message: "Segment deleted successfully" });
    } catch (error) {
      console.error("Error deleting segment:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  },
};

// Method to get audience size by segment ID
export const getAudienceSizeBySegmentId: RequestHandler = async (req, res) => {
  const segmentId = parseInt(req.params.segmentId, 10); // Get the segment ID from the request parameters

  if (isNaN(segmentId)) {
    res.status(400).json({ error: "Invalid segment ID" }); // Send a 400 response for invalid ID
    return; // Explicitly end execution after sending the response
  }

  try {
    const audienceSize = await calculateAudienceSize(segmentId); // Call the function to calculate audience size

    res.status(200).json({ audienceSize }); // Send the audience size in the response
  } catch (error) {
    console.error("Error fetching audience size:", error);

    res.status(500).json({ error: "Internal server error" }); // Send a 500 response for server issues
  }
};
