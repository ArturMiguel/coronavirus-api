import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import { Server } from "./Server";
import { ScraperService } from "./services/ScraperService";

async function bootstrap() {
    try {
        const platform = await PlatformExpress.bootstrap(Server);
        await platform.listen();

        const scraperService = new ScraperService();
        scraperService.schedule("0 0 * * *");

        process.on("SIGINT", () => {
            platform.stop();
        });
    } catch (error) {
        $log.error({ event: "SERVER_BOOTSTRAP_ERROR", error });
    }
}

bootstrap();
