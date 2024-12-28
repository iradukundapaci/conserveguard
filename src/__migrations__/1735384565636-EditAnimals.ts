import { MigrationInterface, QueryRunner } from "typeorm";

export class EditAnimals1735384565636 implements MigrationInterface {
  name = "EditAnimals1735384565636";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "location"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "tips"`);
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "species" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "latitude" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "longitude" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "longitude"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "latitude"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "species"`);
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "tips" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD "location" character varying NOT NULL`,
    );
  }
}
