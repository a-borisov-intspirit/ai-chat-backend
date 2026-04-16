import type { Request, Response } from 'express';
import console = require('node:console');
const OpenAI = require("openai");
const Anthropic = require('@anthropic-ai/sdk');
const { executeQuery } = require('../helpers/db_connect');

const openAi_client = new OpenAI();
const anthropic_client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY']
});


const getChats = async (req: any, res: Response) => {
  const { userid } = req.headers
  const result = await executeQuery('SELECT * FROM "chats" WHERE owner_id = $1 LIMIT 50', [userid]);
  res.send(result);
}

const createChat = async (req: Request, res: Response) => {
  const { userid } = req.headers
  const name = `New Chat ${new Date()}`
  const result = await executeQuery(`
    INSERT INTO chats (name, owner_id)
    VALUES ('${name}', ${userid})
    RETURNING id, name;
`);
  res.send(result);
}

const deleteChat = async (req: Request, res: Response) => {
  const chat_id = req.params.id
  await executeQuery(`
    DELETE FROM "chats"
    WHERE id = $1
  `, [chat_id]);
  res.status(200).send('Chat deleted');
}

const getMessages = async (req: Request, res: Response) => {
  const chat_id = req.params.id
  const result = await executeQuery('SELECT * FROM "messages" WHERE chat_id = $1 LIMIT 50', [chat_id]);
  res.send(result);
}

const addMessage = async (req: Request, res: Response) => {
  const { content, owner_id, role, type } = req.body
  const tokensData = await executeQuery(`
    SELECT remaining_tokens, refresh_tokens_date FROM users 
    WHERE id = ${owner_id}
  `);
  const now = new Date();
  const refreshDate = new Date(tokensData[0].refresh_tokens_date);

  if (tokensData[0].remaining_tokens && tokensData[0].remaining_tokens <= 300) {
    return res.status(400).send('Tokens limit exceeded');
  }

  if (!tokensData[0].remaining_tokens ||
    (tokensData[0].refresh_tokens_date && refreshDate < now)) {
    await executeQuery(`
      UPDATE users
      SET
        remaining_tokens = ${process.env.USER_DAYLY_LIMIT},
        refresh_tokens_date = CURRENT_DATE + INTERVAL '1 day'
      WHERE id = ${owner_id};
      `)
  }

  const chat_id = req.params.id

  const history = await executeQuery(`
    SELECT content, role FROM messages
    WHERE chat_id = $1
  `, [chat_id]);

  let response;

  if (type == "openAi") {
    const ai_response = await openAi_client.responses.create({
      model: "gpt-5.4",
      input: [...history, { role: "user", content: content }],
    });
    await executeQuery(`
      INSERT INTO messages (content, owner_id, role, chat_id)
      VALUES ($1, $2, $3, $4),($5, $6, $7, $8)
      RETURNING id
    `, [
      content, owner_id, role, chat_id,
      ai_response.output_text, owner_id, 'assistant', chat_id
    ]);
    const tokensRes = await executeQuery(`
      UPDATE users
      SET
        remaining_tokens = remaining_tokens - ${ai_response.usage.total_tokens}
      WHERE id = ${owner_id}
      RETURNING remaining_tokens
      `)
    response = { content: ai_response.output_text, remainingTokens: tokensRes[0].remaining_tokens }


  } else {
    const ai_response = await anthropic_client.messages.create({
      max_tokens: 1024,
      messages: [...history, { role: "user", content: content }],
      model: 'claude-haiku-4-6',
    });
    const tokensRes = await executeQuery(`
      UPDATE users
      SET
        remaining_tokens = remaining_tokens - ${ai_response.usage.input_tokens} - ${ai_response.usage.output_tokens}
      WHERE id = ${owner_id}
      RETURNING remaining_tokens
      `)

    response = { content: ai_response.content[0].text, remainingTokens: tokensRes[0].remaining_tokens }
    await executeQuery(`
      INSERT INTO messages (content, owner_id, role, chat_id)
      VALUES ($1, $2, $3, $4),($5, $6, $7, $8)
      RETURNING id
    `, [
      content, owner_id, role, chat_id,
      ai_response.content[0].text, owner_id, 'assistant', chat_id
    ]);
  }

  res.send(response);
}
module.exports = { getChats, createChat, deleteChat, getMessages, addMessage };