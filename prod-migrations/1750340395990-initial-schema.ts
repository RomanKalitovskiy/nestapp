import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1750340395990 implements MigrationInterface {
  name = 'InitialSchema1750340395990';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR NOT NULL,
                "password" VARCHAR NOT NULL,
                "admin" BOOLEAN NOT NULL DEFAULT true
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "report" (
                "id" SERIAL PRIMARY KEY,
                "price" INTEGER NOT NULL,
                "make" VARCHAR NOT NULL,
                "model" VARCHAR NOT NULL,
                "year" INTEGER NOT NULL,
                "mileage" INTEGER NOT NULL,
                "lng" INTEGER NOT NULL,
                "lat" INTEGER NOT NULL,
                "approved" BOOLEAN NOT NULL DEFAULT false,
                "userId" INTEGER,
                CONSTRAINT "FK_user_report" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
