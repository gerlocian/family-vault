'use strict';

import curry from 'lodash/curry';
import {isPopulatedObject, isType, isEmpty, isUndefined} from './../utils/variableValidation';

/**
 * Converts an object into a document suitable for storage based on the model provided.
 * convertDocument : Array -> Object -> Object
 *
 * @param model { Array } The model used to validate and convert the object into the document.
 * @param document { Object } The object to convert into the document.
 * @throws if any of the fields in the document do not conform to the requirements of the model.
 * @return { Object } The newly converted document from the object.
 */
const convertDocument = curry((model, document) => {
    let errors = [];
    let newDocument = {};

    if (! isType('array', model) || isEmpty(model)) {
        errors = errors.concat(
            {errorCode: 'c2bab087-b97c-42cf-935a-cc0cdced9d1e', errorMsg: 'Model is invalid'}
        );
    }

    /*
    if (! isType('array', model) || isEmpty(model)) throw 'Model must be a populated object.';
    if (! isPopulatedObject(document)) throw 'Document must be a populated object';

    model.filter(({required}) => required).forEach(({name}) => {
        if (isEmpty(document[name]))
            throw `Field '${name}' is not defined on the document and is required`;
    });

    model.forEach(({name, type}) => {
        if (!isType(type, document[name]) && !isUndefined(document[name]))
            throw `Field '${name}' is not the correct type. Defined in model as ${type}`;

        if (isEmpty(document[name]) && !isUndefined(document[name]))
            throw `Field '${name}' is an empty value.`;
    });

    return model.reduce((doc, {name}) => {
        doc[name] = document[name];
        return doc;
    }, {});
    */

    newDocument.errors = errors;

    return newDocument;
});

export default convertDocument;
