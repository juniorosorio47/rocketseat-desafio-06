import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1658413078813 implements MigrationInterface {
    name = 'PostRefactoring1658413078813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" RENAME COLUMN "category_id" TO "categoryId"`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64"`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" RENAME COLUMN "categoryId" TO "category_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
