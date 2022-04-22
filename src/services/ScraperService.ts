import { Inject, Service } from "@tsed/di";
import puppeteer from "puppeteer";
import { ICountry } from "../types/ICountry";
import { IState } from "../types/IState";
import { $log } from "@tsed/logger";
import { COUNTRY_REPOSITORY } from "../datasources/repositories/CountryRepository";
import { STATE_REPOSITORY } from "../datasources/repositories/StateRepository";
import { StateEntity } from "../datasources/entities/StateEntity";
import cron from "node-cron";

@Service()
export class ScraperService {
    @Inject(COUNTRY_REPOSITORY)
    protected countryRepository: COUNTRY_REPOSITORY;

    @Inject(STATE_REPOSITORY)
    protected stateRepository: STATE_REPOSITORY;

    async googleNews() {
        const uri = "https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419";

        const browser = await puppeteer.launch({
            args: ["--no-sandbox"]
        })

        try {
            const page = await browser.newPage();

            // Blocks some resources to optimize page loading
            await page.setRequestInterception(true);
            const blockedResources = ["stylesheet", "image", "media", "font", "texttrack", "xhr", "fetch", "eventsource", "websocket", "manifest", "other"];

            page.on("request", (req) => {
                if (blockedResources.indexOf(req.resourceType()) !== -1) req.abort();
                else req.continue();
            })

            await page.goto(uri, {
                waitUntil: "load",
                timeout: 0
            })

            // Hover table div to trigger data fetch
            await page.hover('div[jsaction="pSI0Dc:mMUZad;c6HY:uUug7c;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]');

            let countries: ICountry[] = await page.$$eval('table[class="pH8O4c"] tbody tr', (rows) => {
                return rows.map((row) => {
                    const tds = row.querySelectorAll("td") as any;
                    const spans = row.querySelectorAll("th div div") as any;

                    return {
                        googleId: row.getAttribute("data-id") as string,
                        name: spans[spans.length - 1].textContent as string,
                        confirmed: tds[0].textContent as string,
                        death: tds[4].textContent as string,
                        states: []
                    }
                })
            })

            countries.shift(); // Remove global data

            for await (let country of countries) {
                $log.info(`Fetching states of ${country.name}`);
                const uri = `https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR%3Apt-419&mid=${country.googleId}`;

                await page.goto(uri, {
                    waitUntil: "load",
                    timeout: 0
                })
                const tableHover = await page.$(`div[jsaction="pSI0Dc:mMUZad;c6HY:uUug7c;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]`);
                if (tableHover != null) await tableHover.hover();

                country.states = await page.$$eval(`table[class="pH8O4c"] tbody tr`, (rows: any, country: ICountry) => {
                    return rows.map((row: any) => {
                        const tds = row.querySelectorAll("td") as any;
                        const spans = row.querySelectorAll("th div div") as any;
                        return {
                            googleId: row.getAttribute("data-id") as string,
                            name: spans[spans.length - 1].textContent as string,
                            confirmed: tds[0].textContent as string,
                            death: tds[4].textContent as string,
                        }
                    }).filter((state: IState) => !["Global", country.name].includes(state.name));
                }, country as any)
            }

            const upsertOptions = {
                conflictPaths: ["googleId"]
            }

            for await (let country of countries) {
                const now = new Date().toISOString()

                try {
                    const savedCountry = await this.countryRepository.upsert({
                        ...country,
                        updatedAt: now
                    }, upsertOptions);
                    await this.stateRepository.upsert(country.states.map(state => this.stateRepository.create({
                        ...state,
                        countryId: savedCountry.raw[0].id,
                        updatedAt: now
                    })), upsertOptions);
                } catch (error) {
                    $log.error({
                        event: "DATABASE_SYNC_ERROR",
                        error: error.message,
                        country
                    })
                }
            }

            return true;
        } catch (error) {
            $log.error({
                event: "SCRAPER_ERROR",
                error: error.message
            });
            throw error;
        } finally {
            await browser.close();
        }
    }

    schedule(cronExpression: string) {
        $log.info(`[Scraper] Scheduler registred with expression ${cronExpression}`);
        cron.schedule(cronExpression, () => {
            $log.info("[Scraper] Scheduler started");
        })
    }
}