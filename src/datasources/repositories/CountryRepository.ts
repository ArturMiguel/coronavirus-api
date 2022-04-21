import { registerProvider } from "@tsed/di";
import { CountryEntity } from "../entities/CountryEntity";
import { PostgresDataSource } from "../PostgresDataSource";

export const CountryRepository = PostgresDataSource.getRepository(CountryEntity);
export const COUNTRY_REPOSITORY = Symbol.for("CountryRepository");
export type COUNTRY_REPOSITORY = typeof CountryRepository;

registerProvider({
    provide: COUNTRY_REPOSITORY,
    useValue: CountryRepository
});