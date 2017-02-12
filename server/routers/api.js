'use strict';

import { api as logger } from './../loggers';
import express from 'express';

logger.debug('initializing router...');

const router = express.Router();

logger.debug('router initialized. setting routes...');

router.get('/books', (req, res) => {
    res.end('you have many books');
});

router.get('/movies', (req, res) => {
    res.end('you have many movies');
});

logger.debug('routes complete. exporting router...');
export default router;
