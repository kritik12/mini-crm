import { getMySQLConnection } from "../config/mysqlClient";
import { getCustomerIdsBySegment } from "./segmentHandler";
import { RowDataPacket } from "mysql2";

const messageSuccessRate = 0.7; // 70% success rate for message delivery
// Function to bulk insert into communications log
const bulkInsertCommunicationLog = async (
  logs: Array<{ userId: number; message: string; campaignId: number }>
) => {
  const connection = await getMySQLConnection();
  try {
    const query = `
      INSERT INTO communication_logs (customer_id, campaign_id, message, status, created_at)
      VALUES ?
    `;

    const values = logs.map((log) => {
      const randomNum = Math.random();
      const status = randomNum < messageSuccessRate ? "SENT" : "FAILED";
      return [log.userId, log.campaignId, log.message, status, new Date()];
    });

    await connection.query(query, [values]);
    console.log("Bulk insert into communications_log successful.");
  } catch (error) {
    console.error("Error inserting into communications_log:", error);
    throw error;
  } finally {
    connection.release();
  }
};

interface UserDetails {
  name: string;
}

// Function to replace placeholders in the message template
const personalizeMessage = (
  messageTemplate: string,
  userDetails: UserDetails
): string => {
  // Replace [Name] placeholder with actual user name
  return messageTemplate.replace(/\[Name\]/g, userDetails.name || "[Name]");
};

// Function to insert a new campaign
export const insertCampaign = async (
  segmentId: number,
  audienceSize: number,
  messageTemplate: string
) => {
  const connection = await getMySQLConnection();

  try {
    const query = `
      INSERT INTO campaigns (segment_id, audience_size, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `;
    const [result] = await connection.execute(query, [segmentId, audienceSize]);
    const insertId = (result as any).insertId;

    // Get detailed user information for the specified segment
    const userDetails = await getCustomerIdsBySegment(segmentId);

    // Prepare logs with personalized messages
    const logs = userDetails.map(({ id, name }) => ({
      userId: id,
      message: personalizeMessage(messageTemplate, { name }), // Pass only the name for personalization
      campaignId: insertId,
    }));

    // Bulk insert into communications_log
    await bulkInsertCommunicationLog(logs);

    return insertId;
  } catch (error) {
    console.error("Error inserting campaign:", error);
    throw error;
  } finally {
    connection.release();
  }
};
// Function to fetch all campaigns ordered by latest sent
export const fetchAllCampaigns = async () => {
  const connection = await getMySQLConnection();

  try {
    const query = `
      SELECT campaigns.*, segments.segment_name
      FROM campaigns
      JOIN segments ON campaigns.segment_id = segments.id
      ORDER BY campaigns.created_at DESC
    `;
    const [results] = await connection.execute(query);
    return results; // Return the campaigns with segment names
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  } finally {
    connection.release();
  }
};
// Function to get campaign statistics by campaign ID
export const getCampaignStatsById = async (campaignId: string) => {
  const connection = await getMySQLConnection();

  try {
    // Query to get campaign details and message delivery stats
    const query = `

    SELECT 
      c.id AS campaign_id,
      c.segment_id,
      (SELECT s.segment_name FROM segments AS s WHERE s.id = c.segment_id) AS segment_name,
      c.audience_size,
      c.created_at,  
      COUNT(CASE WHEN cl.status = 'SENT' THEN 1 END) AS total_sent,
      COUNT(CASE WHEN cl.status = 'FAILED' THEN 1 END) AS total_failed

    FROM campaigns AS c
    LEFT JOIN communication_logs AS cl ON c.id = cl.campaign_id
    WHERE c.id = ?
    GROUP BY c.id;

  `;
    const [results] = await connection.execute<RowDataPacket[]>(query, [
      campaignId,
    ]);

    // Check if the campaign exists
    if (results.length === 0) {
      throw new Error("Campaign not found");
    }

    return results[0]; // Return the campaign stats as an object
  } catch (error) {
    console.error("Error fetching campaign stats:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// Function to get delivery receipt by campaign ID and  email
export const getDeliveryReceipt = async (
  campaignId: number,
  mobileNumber?: bigint
) => {
  const connection = await getMySQLConnection();

  try {
    const customerQuery = `
        SELECT id FROM customers
        WHERE mobile_number = ?;
      `;
    const [customerRows] = await connection.execute<RowDataPacket[]>(
      customerQuery,
      [mobileNumber]
    );

    // Check if the customer exists
    if (customerRows.length === 0) {
      throw new Error("Customer not found with the provided email");
    }

    var userId = customerRows[0].id; // Get userId from the fetched customer

    // Now we have userId, proceed to fetch the delivery receipt
    const query = `
      SELECT *
      FROM communication_logs
      WHERE campaign_id = ? AND customer_id = ?;
    `;

    const [rows] = await connection.execute<RowDataPacket[]>(query, [
      campaignId,
      userId,
    ]);

    // Check if the delivery receipt exists
    if (rows.length === 0) {
      throw new Error("Delivery receipt not found");
    }

    return rows[0]; // Return the first result as an object
  } catch (error) {
    console.error("Error fetching delivery receipt:", error);
    throw new Error("Database query failed");
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};
