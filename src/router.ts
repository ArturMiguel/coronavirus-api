import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import CoronavirusController from './controllers/CoronavirusController';
import swaggerDocument from './assets/swagger.json';

const router = Router();

const coronavirusController = new CoronavirusController();

router.get('/global', coronavirusController.global);
router.get('/countries', coronavirusController.countries);
router.get('/countries/:country', coronavirusController.countries);
router.get('/states/:state', coronavirusController.states);

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'coronavirus-api',
    customfavIcon: '.'
}));

export default router;
