import { getMySQLConnection } from "../config/mysqlClient";
import { RowDataPacket } from "mysql2";

// Define an interface for the customer details
interface CustomerDetails {
  id: number;
  email: string;
  name: string;
  mobile_number: bigint;
  total_spending?: number;
  last_visit?: string;
  visit_count?: number;
}

// Function to insert a new customer
const insertCustomer = async (
  customerEmail: string,
  customerName: string,
  mobileNumber: bigint
) => {
  const connection = await getMySQLConnection();

  try {
    const query = `
      INSERT INTO customers (email, name,mobile_number)
      VALUES (?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      customerEmail,
      customerName,
      mobileNumber,
    ]);

    const insertId = (result as any).insertId; // Access insertId
    console.log("Customer inserted with ID:", insertId);
    return insertId; // Return the ID of the newly inserted customer
  } catch (error) {
    console.error("Error inserting customer:", error);
    throw error; // Rethrow the error for further handling
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Function to insert an order and update the customer
export const insertOrder = async (
  customerId: number,
  customerEmail: string,
  customerName: string,
  mobileNumber: bigint,
  purchaseAmount: number,
  purchaseDate?: string
) => {
  const connection = await getMySQLConnection();

  try {
    // Check if customerId is 0, indicating a new customer
    if (customerId === 0) {
      // Insert the new customer
      customerId = await insertCustomer(
        customerEmail,
        customerName,
        mobileNumber
      );
    }

    // Now insert the order
    const query = `
      INSERT INTO orders (customer_id, purchase_amount, purchase_date)
      VALUES (?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      customerId,
      purchaseAmount,
      purchaseDate,
    ]);

    const insertId = (result as any).insertId; // Access insertId
    console.log("Order inserted with ID:", insertId);

    // Update the customer record
    const updateQuery = `
      UPDATE customers
      SET total_spending = COALESCE(total_spending, 0) + ?, 
          last_visit = ?, 
          visit_count = COALESCE(visit_count, 0) + 1
      WHERE id = ?
    `;
    await connection.execute(updateQuery, [
      purchaseAmount,
      purchaseDate,
      customerId,
    ]);
    console.log("Customer updated successfully.");

    return insertId; // Return the ID of the newly inserted order
  } catch (error) {
    console.error("Error inserting order or updating customer:", error);
    throw error; // Rethrow the error for further handling
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

export const findCustomerByMobile = async (
  customerMobile: bigint
): Promise<CustomerDetails | null> => {
  const connection = await getMySQLConnection();

  try {
    const query = `
      SELECT * FROM customers WHERE mobile_number = ?
    `;
    // Use the correct typing for rows
    const [rows] = await connection.execute<RowDataPacket[]>(query, [
      customerMobile,
    ]);

    if (rows.length > 0) {
      // Return the first row as CustomerDetails
      return rows[0] as CustomerDetails;
    } else {
      return null; // Return null if no customer found
    }
  } catch (error) {
    console.error("Error finding customer:", error);
    throw new Error("Database query failed"); // Throw an error to be handled in the controller
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};
