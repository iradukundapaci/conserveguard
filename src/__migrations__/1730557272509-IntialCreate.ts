import { MigrationInterface, QueryRunner } from "typeorm";

export class IntialCreate1730557272509 implements MigrationInterface {
    name = 'IntialCreate1730557272509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" ADD "poacherId" integer`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD CONSTRAINT "UQ_dee5f2950d410f0164e550bfb34" UNIQUE ("poacherId")`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD CONSTRAINT "FK_dee5f2950d410f0164e550bfb34" FOREIGN KEY ("poacherId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP CONSTRAINT "FK_dee5f2950d410f0164e550bfb34"`);
        await queryRunner.query(`ALTER TABLE "incidents" DROP CONSTRAINT "UQ_dee5f2950d410f0164e550bfb34"`);
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "poacherId"`);
    }

}
