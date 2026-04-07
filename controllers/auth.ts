import type { Request, Response } from 'express';
const { executeQuery } = require('../helpers/db_connect');
const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await executeQuery(`
    INSERT INTO users (email, password)
    SELECT '${email}', '${password}'
    WHERE NOT EXISTS (
      SELECT 1 FROM users WHERE email = '${email}'
    )
    RETURNING id;
`);
  res.send(result);
}

const login = async (req: any, res: Response) => {
  const { email, password } = req.body;
  const result = await executeQuery(`SElECT 1 FROM users WHERE email='${email}' AND password='${password}';
`);
  res.send(result);
}


module.exports = { createUser, login };