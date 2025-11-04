import type { FastifyInstance } from 'fastify';
import type { Kysely } from 'kysely';
import type { Database, IdeaId, NewIdea, IdeaUpdate } from '@savetheraise/shared';
import {
  createIdea,
  getIdeasByStatus,
  updateIdea,
  getIdeaById,
} from '../services/ideas';
import { createAuthMiddleware } from '../middleware/auth';

export async function ideasRoutes(fastify: FastifyInstance, db: Kysely<Database>) {
  const initialAuthMiddleware = createAuthMiddleware('initial');
  const committeeAuthMiddleware = createAuthMiddleware('committee');

  /**
   * Submit a new idea
   */
  fastify.post<{ Body: NewIdea }>('/ideas', async (request, reply) => {
    try {
      const idea = await createIdea(db, request.body);
      return reply.status(201).send(idea);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to create idea' });
    }
  });

  /**
   * Get ideas for initial review (status: submitted)
   */
  fastify.get(
    '/ideas/initial-review',
    { preHandler: initialAuthMiddleware },
    async (request, reply) => {
      try {
        const ideas = await getIdeasByStatus(db, 'submitted');
        return reply.send(ideas);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to fetch ideas' });
      }
    }
  );

  /**
   * Get ideas for committee review (status: committee_review)
   */
  fastify.get(
    '/ideas/committee-review',
    { preHandler: committeeAuthMiddleware },
    async (request, reply) => {
      try {
        const ideas = await getIdeasByStatus(db, 'committee_review');
        return reply.send(ideas);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to fetch ideas' });
      }
    }
  );

  /**
   * Update idea status or fields
   */
  fastify.patch<{
    Params: { id: IdeaId };
    Body: IdeaUpdate;
  }>('/ideas/:id', { preHandler: committeeAuthMiddleware }, async (request, reply) => {
    try {
      const idea = await getIdeaById(db, request.params.id);
      if (!idea) {
        return reply.status(404).send({ error: 'Idea not found' });
      }

      const updated = await updateIdea(db, request.params.id, request.body);
      return reply.send(updated);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to update idea' });
    }
  });

  /**
   * Update idea status from initial review
   */
  fastify.patch<{
    Params: { id: IdeaId };
    Body: { status: 'rejected_initial' | 'committee_review'; reviewer_notes?: string };
  }>(
    '/ideas/:id/initial-review',
    { preHandler: initialAuthMiddleware },
    async (request, reply) => {
      try {
        const idea = await getIdeaById(db, request.params.id);
        if (!idea) {
          return reply.status(404).send({ error: 'Idea not found' });
        }

        const updated = await updateIdea(db, request.params.id, {
          status: request.body.status,
          reviewer_notes: request.body.reviewer_notes,
        });
        return reply.send(updated);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to update idea' });
      }
    }
  );
}
