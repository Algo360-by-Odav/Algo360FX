import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserPreferences1703678620 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user_preferences",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "userId",
                        type: "uuid"
                    },
                    {
                        name: "theme",
                        type: "varchar",
                        default: "'light'"
                    },
                    {
                        name: "notifications",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "language",
                        type: "varchar",
                        default: "'en'"
                    },
                    {
                        name: "timezone",
                        type: "varchar",
                        default: "'UTC'"
                    },
                    {
                        name: "chartPreferences",
                        type: "jsonb",
                        isNullable: true
                    },
                    {
                        name: "tradingPreferences",
                        type: "jsonb",
                        isNullable: true
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()"
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["userId"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_preferences");
    }
}