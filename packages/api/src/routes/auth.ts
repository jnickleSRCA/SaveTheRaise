import type { FastifyInstance } from 'fastify';
import { validatePassword, type Role } from '../middleware/auth';

export async function authRoutes(fastify: FastifyInstance) {
  /**
   * Login with password
   */
  fastify.post<{
    Body: { password: string; role: Role };
  }>('/auth/login', async (request, reply) => {
    const { password, role } = request.body;

    if (!role || (role !== 'initial' && role !== 'committee')) {
      return reply.status(400).send({ error: 'Invalid role' });
    }

    if (!validatePassword(password, role)) {
      return reply.status(401).send({ error: 'Invalid password' });
    }

    reply.setCookie(`auth_${role}`, 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return reply.send({ success: true, role });
  });

  /**
   * Logout
   */
  fastify.post<{
    Body: { role: Role };
  }>('/auth/logout', async (request, reply) => {
    const { role } = request.body;

    if (!role || (role !== 'initial' && role !== 'committee')) {
      return reply.status(400).send({ error: 'Invalid role' });
    }

    reply.clearCookie(`auth_${role}`, { path: '/' });
    return reply.send({ success: true });
  });

  /**
   * Check authentication status
   */
  fastify.get<{
    Querystring: { role: Role };
  }>('/auth/status', async (request, reply) => {
    const { role } = request.query;

    if (!role || (role !== 'initial' && role !== 'committee')) {
      return reply.status(400).send({ error: 'Invalid role' });
    }

    const isAuthenticated = request.cookies[`auth_${role}`] === 'authenticated';
    return reply.send({ authenticated: isAuthenticated, role });
  });
}
