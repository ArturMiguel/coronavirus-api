import { join } from "path";
import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/swagger";
import { config } from "./config";
import "./HttpExceptionFilter";

@Configuration({
    ...config,
    acceptMimes: ["application/json"],
    port: process.env.PORT,
    mount: {
        "/v1": `${__dirname}/controllers/v1/*.{js,ts}`,
        "/": `${__dirname}/controllers/pages/*.{js,ts}`
    },
    componentsScan: [`${__dirname}/services/*.{js,ts}`],
    middlewares: [
        cors(),
        methodOverride(),
        bodyParser.json(),
        bodyParser.urlencoded({
            extended: true
        })
    ],
    views: {
        root: join(process.cwd(), "../views"),
        extensions: {
            ejs: "ejs"
        }
    }
})
export class Server {
    @Inject()
    protected app: PlatformApplication;

    @Configuration()
    protected settings: Configuration;
}
