import type { Kysely } from 'kysely';
import { sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  // Create ideas table
  await db.schema
    .createTable('ideas')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('submitter_names', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull().defaultTo('submitted'))
    .addColumn('dollar_value', 'numeric(12, 2)', (col) => col.notNull())
    .addColumn('old_pn', 'text')
    .addColumn('old_cost', 'numeric(12, 2)')
    .addColumn('new_pn', 'text')
    .addColumn('new_cost', 'numeric(12, 2)')
    .addColumn('eau', 'integer')
    .addColumn('calculated_impact', 'numeric(12, 2)')
    .addColumn('area_to_improve', 'text')
    .addColumn('customers_affected', 'text')
    .addColumn('impact_description', 'text')
    .addColumn('notes', 'text')
    .addColumn('reviewer_notes', 'text')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  // Create index on status for faster filtering
  await db.schema.createIndex('ideas_status_idx').on('ideas').column('status').execute();

  // Create index on type
  await db.schema.createIndex('ideas_type_idx').on('ideas').column('type').execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('ideas').execute();
}
