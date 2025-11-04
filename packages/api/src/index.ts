import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { createDb } from './db/connection';
import { ideasRoutes } from './routes/ideas';
import { authRoutes } from './routes/auth';
import { scoreboardRoutes } from './routes/scoreboard';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/savetheraise';

async function start() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  await fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'savetheraise-secret-change-in-production',
  });

  // Create database connection
  const db = createDb(DATABASE_URL);

  // Register routes
  await fastify.register(async (instance) => {
    await authRoutes(instance);
    await ideasRoutes(instance, db);
    await scoreboardRoutes(instance, db);
  });

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  // Start server
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`✓ Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
