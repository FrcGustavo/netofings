import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAgentTokens1776054140334 implements MigrationInterface {
  name = 'AddAgentTokens1776054140334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "agent_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying(255) NOT NULL, "descripcion" character varying(255), "revoked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "agentId" uuid, CONSTRAINT "PK_bb0efa1218b9454920a6d7e2500" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_dce8345fba29a2a38b597b56b6" ON "agent_tokens" ("token") `,
    );
    await queryRunner.query(
      `ALTER TABLE "agent_tokens" ADD CONSTRAINT "FK_6dc4f8f1b70439239d5910e715b" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agent_tokens" DROP CONSTRAINT "FK_6dc4f8f1b70439239d5910e715b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dce8345fba29a2a38b597b56b6"`,
    );
    await queryRunner.query(`DROP TABLE "agent_tokens"`);
  }
}
