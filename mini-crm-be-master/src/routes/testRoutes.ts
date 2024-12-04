import { Router, RequestHandler } from "express";
import {
  testRedisConnection,
  testMySQLConnection,
} from "../controllers/testController"; // Import the controller
import { addEvent, customerController } from "../controllers/ordersController"; // Import the controller
import {
  segmentController,
  getAudienceSizeBySegmentId,
} from "../controllers/segmentControllers"; // Import the controller
import {
  addCampaign,
  getAllCampaigns,
  campaignStatsController as getCampaignStatsById,
  deliveryReceiptController,
} from "../controllers/campaignController"; // Import the controller

const router = Router();

// Test routes
router.get("/test-redis", testRedisConnection);
router.get("/test-mysql", testMySQLConnection);

// Order routes
router.post("/new-order", addEvent as RequestHandler);
router.get("/customer/:mobileNumber", customerController.getCustomerByMobile);

// Segment routes
router.post(
  "/create-segment",
  segmentController.createSegment as RequestHandler
);
router.get(
  "/fetch-all-segments",
  segmentController.getSegments as RequestHandler
);
router.get(
  "/get-segment-details/:id",
  segmentController.getSegment as RequestHandler
);
router.post(
  "/update-segment/:id",
  segmentController.updateSegment as RequestHandler
);
router.delete(
  "/delete-segment/:id",
  segmentController.deleteSegment as RequestHandler
);

//Route to get audience size
router.get(
  "/get-audience-size/:segmentId",
  getAudienceSizeBySegmentId as RequestHandler
);

//Routes for campaign management
router.post("/add-campaign", addCampaign as RequestHandler);
router.get("/fetch-all-campaigns", getAllCampaigns as RequestHandler);
router.get(
  "/get-campaign-stats/:campaignId",
  getCampaignStatsById as RequestHandler
);
router.post("/delivery-receipt", deliveryReceiptController as RequestHandler);

export default router;
