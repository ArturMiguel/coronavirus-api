import { SwaggerSettings } from "@tsed/swagger";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", { encoding: "utf8" }));

const swagger: SwaggerSettings[] = [
    {
        path: "/docs",
        specVersion: "3.0.1",
        spec: {
            info: {
                title: "Documentação Coronavírus API",
                version: pkg.version,
                license: {
                    name: "MIT License",
                    url: "https://github.com/ArturMiguel/coronavirus-api/blob/master/LICENSE"
                },
                "description": "API pública para consulta de dados sobre o coronavírus (COVID-19) em países e estados de todo o mundo."
            }
        }
    }
]

export default swagger;