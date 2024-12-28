import { MigrationInterface, QueryRunner } from "typeorm";

export class EditAnimalsTypes1735386290755 implements MigrationInterface {
  name = "EditAnimalsTypes1735386290755";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "latitude"`);
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "latitude" double precision NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "longitude"`);
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "longitude" double precision NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "longitude"`);
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "longitude" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "latitude"`);
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "latitude" integer NOT NULL`,
    );
  }
}
