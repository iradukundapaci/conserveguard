import { MigrationInterface, QueryRunner } from "typeorm";

export class EditIncidentFields1735464789176 implements MigrationInterface {
    name = 'EditIncidentFields1735464789176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "poacherPhone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" ADD "poacherPhone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD "location" character varying NOT NULL`);
    }

}
