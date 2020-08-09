import { Request, Response } from 'express';

import coronavirusData from '../scraper/coronavirus-data.json';
import normalizeString from '../utils/normalizeString';

class CoronavirusController {
    global(request: Request, response: Response) {
        const globalData = coronavirusData.filter(data => data.name === 'Global');
        return response.send(globalData);
    }

    countries(request: Request, response: Response) {
        const { country } = request.params;

        let countries = [];

        if (country) {
            countries = coronavirusData.filter(data => normalizeString(data.name) === normalizeString(country) && data.name !== 'Global');
        } else {
            countries = coronavirusData.filter(data => data.name !== 'Global');
        }

        if (!countries.length) {
            return response.status(400).send({
                error: 'Não foram encontrados resultados para essa pesquisa.'
            });
        }
        
        return response.send(countries);
    }

    states(request: Request, response: Response) {
        const search = request.params.state;

        const countries = coronavirusData.filter(data => {
            return data.name !== 'Global' && data.states?.find(state => normalizeString(state.name) === normalizeString(search));
        });

        if (!countries.length) {
            return response.status(400).send({
                error: 'Não foram encontrados resultados para essa pesquisa.'
            });
        }

        const stateData = countries[0].states?.filter(state => normalizeString(state.name) === normalizeString(search));
        
        return response.send(stateData);
    }
}

export default CoronavirusController;
