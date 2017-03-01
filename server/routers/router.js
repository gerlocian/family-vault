'use strict';

import curry from 'lodash/curry';
import express from 'express';

const route = curry(connector => {
    let router = express.Router();

    router.get('/', (req, res) => {
        connector.find()
            .then(documents => {
                res.send(documents);
            })
            .catch(error => {
                res.
                res.send(error);
            });
    });
});

export default router;
