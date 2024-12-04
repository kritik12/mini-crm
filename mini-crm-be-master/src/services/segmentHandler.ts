import { getMySQLConnection } from "../config/mysqlClient";
import { RowDataPacket } from "mysql2";

// Define an interface for the segment details
export interface SegmentDetails {
  id: number;
  segmentName: string;
  lowPar?: number;
  highPar?: number;
  leastVisits?: number;
  mostVisits?: number;
  lastVisitDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Function to insert a new segment
export const insertSegment = async (
  segment: Omit<SegmentDetails, "id">
): Promise<number> => {
  const connection = await getMySQLConnection();

  try {
    const query = `
      INSERT INTO segments (segment_name, low_par, high_par, least_visits, most_visits, last_visit_days)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      segment.segmentName,
      segment.lowPar,
      segment.highPar,
      segment.leastVisits,
      segment.mostVisits,
      segment.lastVisitDays,
    ]);

    const insertId = (result as any).insertId; // Access insertId
    console.log("Segment inserted with ID:", insertId);
    return insertId; // Return the ID of the newly inserted segment
  } catch (error) {
    console.error("Error inserting segment:", error);
    throw error; // Rethrow the error for further handling
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Function to get all segments
export const getAllSegments = async (): Promise<SegmentDetails[]> => {
  const connection = await getMySQLConnection();

  try {
    const query = `
      SELECT * FROM segments
    `;
    const [rows] = await connection.execute<RowDataPacket[]>(query);
    return rows as SegmentDetails[]; // Return all segments
  } catch (error) {
    console.error("Error fetching segments:", error);
    throw new Error("Database query failed");
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Function to get a segment by ID
export const getSegmentById = async (
  id: number
): Promise<SegmentDetails | null> => {
  const connection = await getMySQLConnection();

  try {
    const query = `
      SELECT * FROM segments WHERE id = ?
    `;
    const [rows] = await connection.execute<RowDataPacket[]>(query, [id]);

    if (rows.length > 0) {
      return rows[0] as SegmentDetails; // Return the first row as SegmentDetails
    } else {
      return null; // Return null if no segment found
    }
  } catch (error) {
    console.error("Error finding segment:", error);
    throw new Error("Database query failed"); // Throw an error to be handled in the controller
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Function to update a segment
export const updateSegment = async (
  id: number,
  segment: Omit<SegmentDetails, "id">
): Promise<number> => {
  const connection = await getMySQLConnection();

  try {
    const query = `
      UPDATE segments SET segment_name = ?, low_par = ?, high_par = ?, least_visits = ?, most_visits = ?, last_visit_days = ?
      WHERE id = ?
    `;
    await connection.execute(query, [
      segment.segmentName,
      segment.lowPar,
      segment.highPar,
      segment.leastVisits,
      segment.mostVisits,
      segment.lastVisitDays,
      id,
    ]);
    console.log("Segment updated successfully.");
    return id; // Return the ID of the updated segment
  } catch (error) {
    console.error("Error updating segment:", error);
    throw error; // Rethrow the error for further handling
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};
// Function to delete a segment
export const deleteSegment = async (id: number): Promise<void> => {
  const connection = await getMySQLConnection();

  try {
    const query = `
      DELETE FROM segments WHERE id = ?
    `;
    await connection.execute(query, [id]);
    console.log("Segment deleted successfully.");
  } catch (error) {
    console.error("Error deleting segment:", error);
    throw error; // Rethrow the error for further handling
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

export const getCustomerIdsBySegment = async (
  segmentId: number
): Promise<{ id: number; name: string }[]> => {
  const connection = await getMySQLConnection();

  try {
    // Fetch the segment parameters from the segments table
    const query = `
      SELECT low_par, high_par, least_visits, most_visits, last_visit_days 
      FROM segments WHERE id = ?
    `;

    const [rows] = await connection.execute<RowDataPacket[]>(query, [
      segmentId,
    ]);

    if (rows.length === 0) {
      throw new Error("Segment not found");
    }

    // Manually map the result to the SegmentDetails interface
    const segment: SegmentDetails = {
      id: segmentId,
      segmentName: rows[0].segment_name,
      lowPar: rows[0].low_par,
      highPar: rows[0].high_par,
      leastVisits: rows[0].least_visits,
      mostVisits: rows[0].most_visits,
      lastVisitDays: rows[0].last_visit_days,
    };

    // Build the query to get customer IDs and names based on segment parameters
    const customerQuery = `
      SELECT id, name FROM customers 
      WHERE total_spending > ? AND total_spending <= ? 
      AND visit_count > ? AND visit_count <= ? 
      AND DATEDIFF(NOW(), last_visit) <= ?
    `;

    // Execute the query with the parameters from the segment
    const [customers] = await connection.execute<RowDataPacket[]>(
      customerQuery,
      [
        segment.lowPar,
        segment.highPar,
        segment.leastVisits,
        segment.mostVisits,
        segment.lastVisitDays,
      ]
    );

    // Return an array of objects containing both customer IDs and names
    return customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
    }));
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw error; // Rethrow the error for further handling
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Function to calculate the size of the audience for a particular segment
export const calculateAudienceSize = async (
  segmentId: number
): Promise<number> => {
  try {
    const customerIds = await getCustomerIdsBySegment(segmentId);

    return customerIds.length; // Return the size of the audience
  } catch (error) {
    console.error("Error calculating audience size:", error);

    throw error; // Re-throw the error for further handling
  }
};
