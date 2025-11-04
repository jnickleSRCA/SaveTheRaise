import type { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthRequest extends FastifyRequest {
  body: {
    password: string;
  };
}

const PASSWORDS = {
  initial: 'initial',
  committee: 'committee',
} as const;

export type Role = keyof typeof PASSWORDS;

/**
 * Validates password for a given role
 */
export function validatePassword(password: string, role: Role): boolean {
  return password === PASSWORDS[role];
}

/**
 * Middleware to check if user is authenticated with a specific role
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
  role: Role
): Promise<void> {
  const sessionRole = request.cookies[`auth_${role}`];

  if (sessionRole !== 'authenticated') {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}

/**
 * Creates auth middleware for a specific role
 */
export function createAuthMiddleware(role: Role) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await requireAuth(request, reply, role);
  };
}
