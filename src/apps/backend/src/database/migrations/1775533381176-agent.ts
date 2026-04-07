import { MigrationInterface, QueryRunner } from 'typeorm';

export class Agent1775533381176 implements MigrationInterface {
  name = 'Agent1775533381176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agents" DROP CONSTRAINT "agents_pkey"`,
    );
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "uuid" character varying(64) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" ADD CONSTRAINT "PK_c0ab05964eedadbce716671b9b1" PRIMARY KEY ("uuid")`,
    );
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "username" character varying(120) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "name" character varying(120) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "hostname"`);
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "hostname" character varying(200) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "hostname"`);
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "hostname" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "username" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" DROP CONSTRAINT "PK_c0ab05964eedadbce716671b9b1"`,
    );
    await queryRunner.query(`ALTER TABLE "agents" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "uuid" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "agents" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "agents" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "agents" ADD CONSTRAINT "agents_pkey" PRIMARY KEY ("id")`,
    );
  }
}
