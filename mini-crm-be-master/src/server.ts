import express, { Request, Response } from "express";
import cors from "cors"; // Importing CORS
import testRoutes from "./routes/testRoutes";
import "./services/ordersSubscriber"; // Importing subscriber functions
import "./services/campaignSubscriber";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhookHandler from "./services/clerkWebhookHandler";

const app = express();
const port = 5000;

// CORS Configuration
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Enable CORS
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Clerk Middleware
app.use(clerkMiddleware());

// Webhook endpoint
app.post("/api/webhooks", async (req: Request, res: Response) => {
  await clerkWebhookHandler(req, res);
});

// Simple test route for checking server
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Test Routes
app.use("/api", testRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
