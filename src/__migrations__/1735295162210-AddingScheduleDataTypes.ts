import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingScheduleDataTypes1735295162210
  implements MigrationInterface
{
  name = "AddingScheduleDataTypes1735295162210";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "dutyStart"`);
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD "dutyStart" TIME NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "dutyEnd"`);
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD "dutyEnd" TIME NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "dutyEnd"`);
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD "dutyEnd" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "dutyStart"`);
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD "dutyStart" character varying NOT NULL`,
    );
  }
}
