import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";

@Controller("/test")
export class TestController {
    @Get("/")
    get() {
        return {
            message: "Covid19"
        }
    }
}
