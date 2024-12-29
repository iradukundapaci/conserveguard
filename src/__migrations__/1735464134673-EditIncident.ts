import { MigrationInterface, QueryRunner } from "typeorm";

export class EditIncident1735464134673 implements MigrationInterface {
    name = 'EditIncident1735464134673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "evidence"`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD "evidence" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "evidence"`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD "evidence" jsonb`);
    }

}
