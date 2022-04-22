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
    async getCountries() {
        return this.countryRepository.find();
    }

    @Get("/:id")
    @Summary("Consulta por país")
    @Description("Retorna dados do coronavírus de um país e seus estados.")
    @Returns(404)
    async getCountryById(@PathParams("id") id: string) {
        const country = await this.countryRepository.findOne({
            where: {
                id
            },
            relations: ["states"]
        }).catch(() => { });
        if (!country) throw new NotFound("Country not found!");
        return country;
    }
}
