import type { Brand } from './brand';
import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

/**
 * Branded ID type for ideas
 */
export type IdeaId = Brand<string, 'IdeaId'>;

/**
 * Idea type enum
 */
export type IdeaType = 'part_change' | 'process_change';

/**
 * Idea status enum
 */
export type IdeaStatus =
  | 'submitted'
  | 'rejected_initial'
  | 'committee_review'
  | 'approved'
  | 'implemented'
  | 'rejected_committee';

/**
 * Database schema for ideas table
 */
export interface IdeasTable {
  id: Generated<IdeaId>;
  submitter_names: string;
  type: IdeaType;
  status: IdeaStatus;
  dollar_value: ColumnType<string, string, string>; // Stored as numeric, handled as string

  // Part Change fields (nullable for process changes)
  old_pn: string | null;
  old_cost: ColumnType<string, string, string> | null;
  new_pn: string | null;
  new_cost: ColumnType<string, string, string> | null;
  eau: number | null;
  calculated_impact: ColumnType<string, string, string> | null;

  // Process Change fields (nullable for part changes)
  area_to_improve: string | null;
  customers_affected: string | null;
  impact_description: string | null;

  // Common fields
  notes: string | null;
  reviewer_notes: string | null;

  created_at: ColumnType<Date, never, never>;
  updated_at: ColumnType<Date, never, Date>;
}

/**
 * Database schema
 */
export interface Database {
  ideas: IdeasTable;
}

/**
 * Helper types for database operations
 */
export type Idea = Selectable<IdeasTable>;
export type NewIdea = Insertable<IdeasTable>;
export type IdeaUpdate = Updateable<IdeasTable>;
