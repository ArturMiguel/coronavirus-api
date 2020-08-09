import puppeteer from 'puppeteer';
import fs from 'fs';

interface Country {
    id?: string;
    name: string;
    confirmed: string;
    recovered: string;
    death: string;
    states?: Array<{
        name: string;
        confirmed: string;
        recovered: string;
        death: string;
    }>
}

async function scraper() {
    console.log('Updating data...');

    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    // Blocks some resources to optimize page loading
    await page.setRequestInterception(true);
    const blockedResources = ['stylesheet', 'image', 'media', 'font', 'texttrack', 'xhr', 'fetch', 'eventsource', 'websocket', 'manifest', 'other'];

    try {
        page.on('request', (req) => {
            if (blockedResources.indexOf(req.resourceType()) !== -1) req.abort();
            else req.continue();
        });

        await page.goto('https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419', {
            waitUntil: 'load',
            timeout: 0
        });
        await page.hover('div[jsaction="pSI0Dc:mMUZad;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]');

        const countries: Country[] = await page.$$eval('table[class="pH8O4c"] tbody tr', (rows) => rows.map((row) => {
            const tds = row.querySelectorAll('td');
            const spans = row.querySelectorAll('th div div');

            const id = row.getAttribute('data-id');
            const name = spans[spans.length - 1].textContent;
            const confirmed = tds[0].textContent;
            const recovered = tds[2].textContent;
            const death = tds[3].textContent;

            return {
                id: id ? id : '-',
                name: name ? name : '-',
                confirmed: confirmed ? confirmed : '-',
                recovered: recovered ? recovered : '-',
                death: death ? death : '-'
            }
        }));

        for (const country of countries) {
            if (country.name !== 'Global') {
                await page.goto(`https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR%3Apt-419&mid=${country.id}`, {
                    waitUntil: 'load',
                    timeout: 0
                });

                const tableHover = await page.$('div[jsaction="pSI0Dc:mMUZad;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]');
                if (tableHover !== null) await tableHover.hover();

                const states = await page.$$eval('table[class="pH8O4c"] tbody tr', (rows, currentCountry) => rows.map((row) => {
                    const tds = row.querySelectorAll('td');
                    const spans = row.querySelectorAll('th div div');

                    const name = spans[spans.length - 1].textContent;
                    const confirmed = tds[0].textContent;
                    const recovered = tds[2].textContent;
                    const death = tds[3].textContent;
        
                    return {
                        name: name ? name : '-',
                        confirmed: confirmed ? confirmed : '-',
                        recovered: recovered ? recovered : '-',
                        death: death ? death : '-'
                    }
                }).filter((state) => state.name !== 'Global' && currentCountry.name !== state.name), country);
                country.states = states;
            }
            delete country.id;
        }
        fs.writeFileSync(`${__dirname}/coronavirus-data.json`, JSON.stringify(countries, null, 4));
        console.log('The data has been updated.');
    } catch (err) {
        console.log('An erros has occurred.', new Error(err).message);
    } finally {
        await browser.close();
    }
}

export default scraper;
