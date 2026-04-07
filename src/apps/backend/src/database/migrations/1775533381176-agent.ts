import { MigrationInterface, QueryRunner } from 'typeorm';

export class Agent1775533381176 implements MigrationInterface {
  name = 'Agent1775533381176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "agents" (
        "uuid" character varying(64) NOT NULL,
        "username" character varying(120) NOT NULL,
        "name" character varying(120) NOT NULL,
        "hostname" character varying(200) NOT NULL,
        "pid" integer NOT NULL,
        "connected" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_c0ab05964eedadbce716671b9b1" PRIMARY KEY ("uuid")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" ADD CONSTRAINT "FK_agents_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agents" DROP CONSTRAINT "FK_agents_user"`,
    );
    await queryRunner.query(`DROP TABLE "agents"`);
  }
}
