import { MigrationInterface, QueryRunner } from "typeorm";

export class EditIncidentUserLink1735480912648 implements MigrationInterface {
    name = 'EditIncidentUserLink1735480912648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP CONSTRAINT "FK_d1d2ade474f985081745e09f930"`);
        await queryRunner.query(`ALTER TABLE "incidents" RENAME COLUMN "reportingUserIdId" TO "rangerId"`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD CONSTRAINT "FK_4b9bd4daf930ba0392239c13228" FOREIGN KEY ("rangerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP CONSTRAINT "FK_4b9bd4daf930ba0392239c13228"`);
        await queryRunner.query(`ALTER TABLE "incidents" RENAME COLUMN "rangerId" TO "reportingUserIdId"`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD CONSTRAINT "FK_d1d2ade474f985081745e09f930" FOREIGN KEY ("reportingUserIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
