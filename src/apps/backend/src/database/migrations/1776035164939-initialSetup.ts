import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1776035164939 implements MigrationInterface {
  name = 'InitialSetup1776035164939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "metrics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "value" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "agentId" uuid NOT NULL, CONSTRAINT "PK_5283cad666a83376e28a715bf0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "agents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(120) NOT NULL, "name" character varying(120) NOT NULL, "hostname" character varying(200) NOT NULL, "pid" integer NOT NULL, "connected" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_9c653f28ae19c5884d5baf6a1d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "avatar" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "metrics" ADD CONSTRAINT "FK_f3fb8aac0bba7a652088eb8a6e6" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" ADD CONSTRAINT "FK_f535e5b2c0f0dc7b7fc656ebc91" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agents" DROP CONSTRAINT "FK_f535e5b2c0f0dc7b7fc656ebc91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metrics" DROP CONSTRAINT "FK_f3fb8aac0bba7a652088eb8a6e6"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "agents"`);
    await queryRunner.query(`DROP TABLE "metrics"`);
  }
}
