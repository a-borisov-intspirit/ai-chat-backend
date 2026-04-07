import type { Request, Response } from 'express';
const { executeQuery } = require('../helpers/db_connect');
const getMessages = async (req: Request, res: Response) => {
  const result = await executeQuery('SELECT * FROM "users" LIMIT 50');
  res.send(result);
}
module.exports = { getMessages };