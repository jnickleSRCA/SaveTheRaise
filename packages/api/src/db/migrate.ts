import { Migrator, FileMigrationProvider } from 'kysely';
import { promises as fs } from 'fs';
import path from 'path';
import { createDb } from './connection';
import dotenv from 'dotenv';

dotenv.config();

async function migrateToLatest() {
  const db = createDb(
    process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/savetheraise'
  );

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`✓ Migration "${it.migrationName}" executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`✗ Failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('Migration failed');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
  console.log('✓ All migrations completed');
}

migrateToLatest();
