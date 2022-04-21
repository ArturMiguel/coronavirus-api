import { Inject, Service } from "@tsed/di";
import puppeteer from "puppeteer";
import { ICountry } from "src/types/ICountry";
import { IState } from "src/types/IState";
import { $log } from "@tsed/logger";
import { COUNTRY_REPOSITORY } from "src/datasources/repositories/CountryRepository";
import { STATE_REPOSITORY } from "src/datasources/repositories/StateRepository";
import { StateEntity } from "src/datasources/entities/StateEntity";

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

            const countries: ICountry[] = await page.$$eval('table[class="pH8O4c"] tbody tr', (rows) => {
                return rows.map((row) => {
                    const tds = row.querySelectorAll("td") as any;
                    const spans = row.querySelectorAll("th div div") as any;

                    return {
                        id: row.getAttribute("data-id") as string,
                        name: spans[spans.length - 1].textContent as string,
                        confirmed: tds[0].textContent as string,
                        death: tds[4].textContent as string
                    }
                })
            })

            countries.shift(); // Remove global data

            for await (let country of countries) {
                $log.info(`Fetching states of ${country.name}`);
                const uri = `https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR%3Apt-419&mid=${country.id}`;

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
                            id: row.getAttribute("data-id") as string,
                            country_id: country.id,
                            name: spans[spans.length - 1].textContent as string,
                            confirmed: tds[0].textContent as string,
                            death: tds[4].textContent as string,
                        }
                    }).filter((state: IState) => !["Global", country.name].includes(state.name));
                }, country as any)
            }

            for await (let country of countries) {
                try {
                    const stateEntities = country.states?.map(state => this.stateRepository.create(state)) as StateEntity[];
                    delete country.states;
                    const countryEntity = this.countryRepository.create(country);
                    await this.countryRepository.save(countryEntity);
                    await this.stateRepository.save(stateEntities);
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
}