import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingTask1735297898463 implements MigrationInterface {
  name = "AddingTask1735297898463";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD "task" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "task"`);
  }
}
