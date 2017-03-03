'use strict';

import { server as logger } from './loggers';
import * as config from './../config';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import router from './routers/router';
import MongoConnector from './models/mongoConnector';
import MongoClient from 'mongodb';
import bookModel from './models/book.model.json';

logger.profile('server build time');
logger.debug('imports complete. building app..');

const app = express();

logger.debug('app complete. building middleware...');
logger.debug(`morgan output set to '${config.MORGAN_CONF}'`);

app.use(morgan(config.MORGAN_CONF));
app.use(bodyParser.json());

logger.debug('middleware complete. building data connectors...');

const booksConnector = MongoConnector(MongoClient, config.DB_URL, 'books', bookModel);

logger.debug('connectors complete. building routers...');

app.use('/api/books', router(express.Router(), booksConnector));

logger.debug('routers complete. starting server...');
logger.debug(`server port set to '${config.SERVER_PORT}'`);

app.listen(config.SERVER_PORT, () => {
    logger.info('Server started.');
    logger.info(`Listening on port ${config.SERVER_PORT}...`);
    logger.profile('server build time');
});
