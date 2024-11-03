import { MigrationInterface, QueryRunner } from "typeorm";

export class IntialCreate1730556216898 implements MigrationInterface {
    name = 'IntialCreate1730556216898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cases" DROP CONSTRAINT "FK_90a7e5e25e4f1f806c454be8dde"`);
        await queryRunner.query(`ALTER TABLE "cases" DROP CONSTRAINT "UQ_90a7e5e25e4f1f806c454be8dde"`);
        await queryRunner.query(`ALTER TABLE "cases" ADD CONSTRAINT "FK_90a7e5e25e4f1f806c454be8dde" FOREIGN KEY ("lawyerId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cases" DROP CONSTRAINT "FK_90a7e5e25e4f1f806c454be8dde"`);
        await queryRunner.query(`ALTER TABLE "cases" ADD CONSTRAINT "UQ_90a7e5e25e4f1f806c454be8dde" UNIQUE ("lawyerId")`);
        await queryRunner.query(`ALTER TABLE "cases" ADD CONSTRAINT "FK_90a7e5e25e4f1f806c454be8dde" FOREIGN KEY ("lawyerId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
