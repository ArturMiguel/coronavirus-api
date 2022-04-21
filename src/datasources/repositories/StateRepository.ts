import { registerProvider } from "@tsed/di";
import { StateEntity } from "../entities/StateEntity";
import { PostgresDataSource } from "../PostgresDataSource";

export const StateRepository = PostgresDataSource.getRepository(StateEntity);
export const STATE_REPOSITORY = Symbol.for("StateRepository");
export type STATE_REPOSITORY = typeof StateRepository;

registerProvider({
    provide: STATE_REPOSITORY,
    useValue: StateRepository
});