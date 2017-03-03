'use strict';

import curry from 'lodash/curry';
import { ObjectID } from 'mongodb';

const route = curry((router, connector) => {
    router.get('/', (req, res) => {
        connector.find()
            .then(documents => { res.send(documents); })
            .catch(error => { res.status(500).send(error); });
    });

    router.get('/:id', (req, res) => {
        connector.findOne({ _id: new ObjectID(req.params.id) })
            .then(document => {
                if (!document) {
                    res.status(404).send('404 Not Found');
                    return;
                }
                res.send(document);
            })
            .catch(error => { res.status(500).send(error); });
    });

    router.post('/', (req, res) => {
        connector.insertOne(req.body)
            .then(() => {
                connector.findOne(req.body)
                    .then(document => { res.status(201).send(document); })
                    .catch(error => { res.status(500).send(error); });
            })
            .catch(error => {
                if (Array.isArray(error.errors) && error.errors.length > 0) {
                    res.status(400).send(error);
                } else {
                    res.status(500).send(error);
                }
            });
    });

    router.delete('/:id', (req, res) => {
        connector.deleteOne({ _id: new ObjectID(req.params.id) })
            .then(() => { res.status(202).send(); })
            .catch(error => { res.status(500).send(error); });
    });

    router.put('/:id', (req, res) => {
        connector.replaceOne({ _id: new ObjectID(req.params.id) }, req.body)
            .then(() => {
                connector.findOne({ _id: new ObjectID(req.params.id) })
                    .then(document => { res.status(202).send(document); })
                    .catch(error => { res.status(500).send(error); });
            })
            .catch(error => {
                if (Array.isArray(error.errors) && error.errors.length > 0) {
                    res.status(400).send(error);
                } else {
                    res.status(500).send(error);
                }
            });
    });

    router.patch('/:id', (req, res) => {
        connector.findOne({ _id: new ObjectID(req.params.id) })
            .then(document => {
                const nDocument = Object.assign({}, document, req.body);
                connector.replaceOne({ _id: new ObjectID(req.params.id) }, nDocument)
                    .then(() => {
                        connector.findOne({ _id: new ObjectID(req.params.id) })
                            .then(document => { res.status(202).send(document); })
                            .catch(error => { res.status(500).send(error); });
                    })
                    .catch(error => {
                        if (Array.isArray(error.errors) && error.errors.length > 0) {
                            res.status(400).send(error);
                        } else {
                            res.status(500).send(error);
                        }
                    });
            })
            .catch(error => { res.status(500).send(error); });
    });

    return router;
});

export default route;
