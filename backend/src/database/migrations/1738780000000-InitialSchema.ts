import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1738780000000 implements MigrationInterface {
  name = 'InitialSchema1738780000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "incidents" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "type" varchar(50) NOT NULL,
        "map_type" varchar(50) NOT NULL,
        "location" varchar(255) NOT NULL,
        "description" text,
        "lat" decimal(10,7),
        "lng" decimal(10,7),
        "title" varchar(255) NOT NULL,
        "vouches_count" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_incidents" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "buddy_groups" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "route" varchar(255) NOT NULL,
        "time" varchar(50) NOT NULL,
        "max_members" integer NOT NULL DEFAULT 8,
        "start_point" varchar(255) NOT NULL,
        "end_point" varchar(255) NOT NULL,
        "verified" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_buddy_groups" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "buddy_group_members" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "group_id" uuid NOT NULL,
        "member_name" varchar(255),
        "session_id" varchar(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_buddy_group_members" PRIMARY KEY ("id"),
        CONSTRAINT "FK_buddy_group_members_group" FOREIGN KEY ("group_id")
          REFERENCES "buddy_groups"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "buddy_group_members"`);
    await queryRunner.query(`DROP TABLE "buddy_groups"`);
    await queryRunner.query(`DROP TABLE "incidents"`);
  }
}
