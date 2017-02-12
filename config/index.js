'use strict';

export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'info';
export const MORGAN_CONF = process.env.MORGAN_CONF || 'combined';

export const DB_DOMAIN = process.env.DB_DOMAIN || 'localhost';
export const DB_PORT = process.env.DB_PORT || 27017;
export const DB_NAME = process.env.DB_NAME || 'familyVault';

