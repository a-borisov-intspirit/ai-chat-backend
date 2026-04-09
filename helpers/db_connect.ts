const { Client } = require('pg');
require('dotenv').config();
const clientConfig = {
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
};

async function executeQuery(query: string, values?: any[]) {
  const client = new Client(clientConfig);
  try {
    await client.connect();
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error executing DB request:', error);
    throw error;
  } finally {
    await client.end();
  }
}
module.exports = { executeQuery };