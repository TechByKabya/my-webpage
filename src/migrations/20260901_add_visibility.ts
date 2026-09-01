import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_projects_visibility" AS ENUM('public', 'private');
    CREATE TYPE "public"."enum_blogs_visibility" AS ENUM('public', 'private');

    ALTER TABLE "projects"
      ADD COLUMN IF NOT EXISTS "visibility" "public"."enum_projects_visibility" DEFAULT 'public';

    ALTER TABLE "blogs"
      ADD COLUMN IF NOT EXISTS "visibility" "public"."enum_blogs_visibility" DEFAULT 'public';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "visibility";
    ALTER TABLE "blogs" DROP COLUMN IF EXISTS "visibility";

    DROP TYPE IF EXISTS "public"."enum_projects_visibility";
    DROP TYPE IF EXISTS "public"."enum_blogs_visibility";
  `)
}
