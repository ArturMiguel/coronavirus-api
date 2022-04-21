import { registerProvider } from "@tsed/di";
import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";

export const POSTGRES_DATASOURCE = Symbol.for("PostgresDataSource");
export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT as string),
    database: process.env.TYPEORM_DATABASE,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    entities: [`${__dirname}/entities/*.{js,ts}`],
    migrations: [`${__dirname}/migrations/*.{js,ts}`],
    ssl: {
        rejectUnauthorized: false
    },
    synchronize: true
})

registerProvider<DataSource>({
    provide: POSTGRES_DATASOURCE,
    type: "typeorm:datasource",
    deps: [Logger],
    async useAsyncFactory(logger: Logger) {
        await PostgresDataSource.initialize();
        await PostgresDataSource.runMigrations();

        logger.info("Connected with typeorm to database: PostgreSQL");

        return PostgresDataSource;
    },
    hooks: {
        $onDestroy(dataSource) {
            return dataSource.isInitialized && dataSource.close();
        }
    }
});