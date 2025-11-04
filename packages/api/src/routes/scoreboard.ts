import type { FastifyInstance } from 'fastify';
import type { Kysely } from 'kysely';
import type { Database } from '@savetheraise/shared';
import { getScoreboardMetrics } from '../services/ideas';

export async function scoreboardRoutes(fastify: FastifyInstance, db: Kysely<Database>) {
  /**
   * Get public scoreboard metrics
   */
  fastify.get('/scoreboard', async (request, reply) => {
    try {
      const metrics = await getScoreboardMetrics(db);
      return reply.send(metrics);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch scoreboard' });
    }
  });
}
