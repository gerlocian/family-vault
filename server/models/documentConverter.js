'use strict';

import curry from 'lodash/curry';
import { docConverter as logger } from '../loggers';
import {isPopulatedObject, isType, isEmpty, isUndefined} from './../utils/variableValidation';

/**
 * Converts an object into a document suitable for storage based on the model provided.
 * convertDocument : Array -> Object -> Object
 *
 * @param model { Array } The model used to validate and convert the object into the document.
 * @param document { Object } The object to convert into the document.
 * @return { Object } The newly converted document from the object.
 */
const convertDocument = curry((model, document) => {
    let errors = [];
    let conversion = {};

    if (! isType('array', model) || isEmpty(model)) {
        logger.debug('Model provided is not an array or is empty.');
        errors = errors.concat({
            errorCode: 'c2bab087-b97c-42cf-935a-cc0cdced9d1e',
            errorMsg: 'Model is invalid.'
        });
    }

    if (! isPopulatedObject(document)) {
        logger.debug('Document is not a valid object or is not populated.');
        errors = errors.concat({
            errorCode: '3fea2875-e462-4842-a3f6-09cb1677a493',
            errorMsg: 'Provided document has no fields.'
        });
    }

    if (isPopulatedObject(document)) {
        model.forEach(({name, type, required}) => {
            const fieldValue = document[name];

            if (required && isEmpty(fieldValue)) {
                logger.debug(`Required field is not defined. Field: ${name}`);
                errors = errors.concat({
                    errorCode: '2097cce8-f4c3-4173-9553-1b9a55248f3f',
                    errorMsg: 'Field is not defined on the document and is required.',
                    errorField: name
                });
            }

            if (!isType(type, fieldValue) && !isUndefined(fieldValue)) {
                logger.debug(`Field value is not the correct type. Field: ${name}, Type: ${type}`);
                errors = errors.concat({
                    errorCode: '56fc8804-3c94-434d-8e51-367680177f04',
                    errorMsg: 'Field does not have valid input.',
                    errorField: name,
                    expectedType: type,
                    providedType: typeof fieldValue
                });
            }

            if (isEmpty(fieldValue) && !isUndefined(fieldValue)) {
                logger.debug(`Field is empty. Field: ${name}`);
                errors = errors.concat({
                    errorCode: 'e12af28f-42c7-4bf1-a2f1-18306735f952',
                    errorMsg: 'Field may not contain an empty string or array.',
                    errorField: name
                });
            }
        });
    }

    if (isEmpty(errors)) {
        conversion.document = model.reduce((d, {name}) => {
            d[name] = document[name];
            return d;
        }, {});
    } else {
        conversion.document = {};
    }

    conversion.errors = errors;

    return conversion;
});

export default convertDocument;
