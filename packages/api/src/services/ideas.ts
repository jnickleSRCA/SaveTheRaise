import type { Kysely, Transaction } from 'kysely';
import type {
  Database,
  IdeaId,
  Idea,
  NewIdea,
  IdeaUpdate,
  IdeaStatus,
} from '@savetheraise/shared';

type KyselyDatabase = Kysely<Database> | Transaction<Database>;

export async function createIdea(db: KyselyDatabase, idea: NewIdea): Promise<Idea> {
  return await db
    .insertInto('ideas')
    .values(idea)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getIdeasByStatus(
  db: KyselyDatabase,
  status: IdeaStatus | IdeaStatus[]
): Promise<Idea[]> {
  let query = db.selectFrom('ideas').selectAll();

  if (Array.isArray(status)) {
    query = query.where('status', 'in', status);
  } else {
    query = query.where('status', '=', status);
  }

  return await query.orderBy('created_at', 'desc').execute();
}

export async function getAllIdeas(db: KyselyDatabase): Promise<Idea[]> {
  return await db.selectFrom('ideas').selectAll().orderBy('created_at', 'desc').execute();
}

export async function updateIdea(
  db: KyselyDatabase,
  id: IdeaId,
  update: IdeaUpdate
): Promise<Idea> {
  return await db
    .updateTable('ideas')
    .set({ ...update, updated_at: new Date() })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getIdeaById(
  db: KyselyDatabase,
  id: IdeaId
): Promise<Idea | undefined> {
  return await db.selectFrom('ideas').selectAll().where('id', '=', id).executeTakeFirst();
}

export interface ScoreboardMetrics {
  total_submitted: number;
  dollar_value_approved: string;
  dollar_value_implemented: string;
}

export async function getScoreboardMetrics(
  db: KyselyDatabase
): Promise<ScoreboardMetrics> {
  const totalCount = await db
    .selectFrom('ideas')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirstOrThrow();

  const approvedValue = await db
    .selectFrom('ideas')
    .select(({ fn }) => [fn.sum<string>('dollar_value').as('total')])
    .where('status', 'in', ['approved', 'implemented'])
    .executeTakeFirstOrThrow();

  const implementedValue = await db
    .selectFrom('ideas')
    .select(({ fn }) => [fn.sum<string>('dollar_value').as('total')])
    .where('status', '=', 'implemented')
    .executeTakeFirstOrThrow();

  return {
    total_submitted: Number(totalCount.count),
    dollar_value_approved: approvedValue.total || '0',
    dollar_value_implemented: implementedValue.total || '0',
  };
}
