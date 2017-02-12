'use strict';

import { LOGGER_LEVEL } from './../../config';
import winston from 'winston';

function createLogger(loggerName) {
    winston.loggers.add(loggerName, {
        console: {
            level: LOGGER_LEVEL,
            colorize: true,
            label: loggerName
        }
    });

    return winston.loggers.get(loggerName);
}

export const server = createLogger('server');
export const api = createLogger('server:api');
