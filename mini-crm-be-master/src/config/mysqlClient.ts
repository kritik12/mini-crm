import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config(); // Load the .env file

// Ensure the CA certificate path is valid
const sslConfig = process.env.MYSQL_CA_CERT
  ? { ca: fs.readFileSync(process.env.MYSQL_CA_CERT) }
  : undefined;

// Create a connection pool once when the module is loaded
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT
    ? parseInt(process.env.MYSQL_PORT, 10)
    : undefined, // Parse port as a number
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Adjust this number as needed
  queueLimit: 0,
  ssl: sslConfig,
});

// Function to get a connection from the pool
export const getMySQLConnection = () => pool.getConnection();
