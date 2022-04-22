import { Controller, Inject } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { PathParams } from "@tsed/platform-params";
import { Description, Get, Returns, Summary, Tags } from "@tsed/schema";
import { STATE_REPOSITORY } from "../../datasources/repositories/StateRepository";

@Controller("/states")
@Tags("Estados")
export class StateController {
    @Inject(STATE_REPOSITORY)
    protected stateRepository: STATE_REPOSITORY;

    @Get("/:id")
    @Summary("Consulta por estado")
    @Description("Retorna dados do coronavírus de um estado.")
    @Returns(404)
    async getStateById(@PathParams("id") id: string) {
        const state = await this.stateRepository.findOne({
            where: {
                id
            },
            order: {
                name: "ASC"
            }
        }).catch(() => { });
        if (!state) throw new NotFound("State not found!");
        return state;
    }
}
