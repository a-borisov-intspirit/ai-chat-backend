# AI Chat Server

Backend API for the AI chat application. This service is an Express + TypeScript server that handles authentication, chat management, database access, and AI provider integrations.

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT authentication
- Cookie-based session handling
- OpenAI SDK
- Anthropic SDK
- CORS and dotenv

## Features

- User signup and login
- Access and refresh token handling
- Cookie-based auth flow
- Protected chat endpoints
- Chat and message CRUD operations
- Database connectivity via PostgreSQL
- AI provider integration support

## API Overview

### Auth

- `POST /auth/create`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Chats

Protected routes under `/chats`:

- `POST /chats`
- `GET /chats`
- `DELETE /chats/:id`
- `GET /chats/:id`
- `POST /chats/:id`

## Project Structure

- `index.ts` - Server bootstrap and middleware setup
- `routes/` - API route definitions
- `controllers/` - Request handlers
- `helpers/` - Database and auth middleware utilities

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- PostgreSQL

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

The server starts with `nodemon` and `ts-node`.

## Environment Variables

Create a `.env` file with the values required by the server:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `ACCESS_KEY`
- `REFRESH_KEY`
- `USER_DAYLY_LIMIT`
- `CLIENT_URL`

## Notes

- The server enables CORS for the configured client origin.
- Chat routes are protected by auth middleware.
- Database configuration is loaded through the helper layer.

## Purpose

This backend provides the secure API surface for authentication, chat persistence, and AI-powered functionality used by the client.
