'use strict';

/*
    TODO:

     GET	/books          find(query)
     GET	/books/:id      findOne(query)
     POST	/books          insertOne(<document>)
     PUT	/books/:id      updateOne(<query>, <document>)
     PATCH	/books/:id      updateOne(<query>, <update>)
     DELETE	/books/:id      deleteOne(<query>)
 */

import { bookApiLogger as logger } from './../loggers';
import * as config from './../../config';
import Model from './../models/model';

import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';

logger.debug('wiring up books model...');

const model = Model(MongoClient, config.DB_URL, 'books');

logger.debug('initializing books router...');

const router = express.Router();

logger.debug('router initialized. setting routes...');

router.get('/', (req, res) => {
    model.find({}).then(documents => {
        res.send(documents);
    }).catch(err => {
        logger.error(err);
        res.status(500).end('Error occurred getting books.');
    });
});

router.get('/:id', (req, res) => {
    model.findOne({ '_id': new ObjectID(req.params.id) }).then(document => {
        if (!document) {
            res.status(404).end();
            return;
        }
        res.send(document);
    }).catch(err => {
        logger.error(err);
        res.status(500).end(`Error occurred getting book by id ${res.params.id}`);
    });
});

router.post('/', (req, res) => {
    model.insertOne(req.body).then(() => {
        res.status(201).end();
    }).catch(err => {
        logger.error(err);
        res.status(500).end('Error occurred inserting book.');
    });
});

router.delete('/:id', (req, res) => {
    model.deleteOne(req.body).then(response => {
        res.send(response);
    }).catch(err => {
        logger.error(err);
        res.status(500).end('Error occurred deleting book.');
    });
});

logger.debug('routes complete. exporting books router...');

export default router;
