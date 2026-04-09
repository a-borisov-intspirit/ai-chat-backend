import type { Request, Response } from 'express';
const OpenAI = require("openai");

const ai_client = new OpenAI();

const { executeQuery } = require('../helpers/db_connect');
const getMessages = async (req: Request, res: Response) => {
  const result = await executeQuery('SELECT * FROM "users" LIMIT 50');
  res.send(result);
}

const addMessage = async (req: Request, res: Response) => {
  const { text, owner_id, role } = req.body

  const result = await executeQuery(`
    INSERT INTO messages (text, owner_id, role)
    VALUES ('${text}', ${owner_id}, '${role}')
    RETURNING id;
`);
  const response = await ai_client.responses.create({
    model: "gpt-5.4",
    input: text,
  });
  const ai_result = await executeQuery(`
  INSERT INTO messages (text, owner_id, role)
  VALUES ($1, $2, $3)
  RETURNING id;
`, [response.output_text, owner_id, 'assistant']);
  res.send(response);
}
module.exports = { getMessages, addMessage };