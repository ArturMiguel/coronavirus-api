import { Controller, Inject } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { PathParams } from "@tsed/platform-params";
import { Description, Get, Returns, Summary, Tags } from "@tsed/schema";
import { COUNTRY_REPOSITORY } from "../../datasources/repositories/CountryRepository";

@Controller("/countries")
@Tags("Países")
export class CountryController {
    @Inject(COUNTRY_REPOSITORY)
    protected countryRepository: COUNTRY_REPOSITORY;

    @Get("/")
    @Summary("Lista de países.")
    @Description("Retorna dados do coronavírus em todos os países.")
    getCountries() {
        return this.countryRepository.find({
            order: {
                name: "ASC"
            }
        });
    }

    @Get("/:id")
    @Summary("Consulta por país")
    @Description("Retorna dados do coronavírus de um país e seus estados.")
    @Returns(404)
    async getCountryById(@PathParams("id") id: string) {
        const country = await this.countryRepository.createQueryBuilder("country")
            .leftJoinAndSelect("country.states", "state")
            .where("country.id = :id", { id })
            .orderBy("state.name", "ASC")
            .getOne().catch(() => {});
        if (!country) throw new NotFound("Country not found!");
        return country;
    }
}
