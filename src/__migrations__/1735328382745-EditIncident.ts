import { MigrationInterface, QueryRunner } from "typeorm";

export class EditIncident1735328382745 implements MigrationInterface {
  name = "EditIncident1735328382745";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_dee5f2950d410f0164e550bfb34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "REL_dee5f2950d410f0164e550bfb3"`,
    );
    await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "poacherId"`);
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD "poacherName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD "poacherPhone" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD "description" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "incidents" ADD "evidence" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD "reportingUserIdId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_d1d2ade474f985081745e09f930" FOREIGN KEY ("reportingUserIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP CONSTRAINT "FK_d1d2ade474f985081745e09f930"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP COLUMN "reportingUserIdId"`,
    );
    await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "evidence"`);
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP COLUMN "poacherPhone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" DROP COLUMN "poacherName"`,
    );
    await queryRunner.query(`ALTER TABLE "incidents" ADD "poacherId" integer`);
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "REL_dee5f2950d410f0164e550bfb3" UNIQUE ("poacherId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidents" ADD CONSTRAINT "FK_dee5f2950d410f0164e550bfb34" FOREIGN KEY ("poacherId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
