'use strict';

import curry from 'lodash/curry';

/**
 * Determines if the provided value is of the provided type.
 * isType : String -> Any -> Boolean
 *
 * @param type { String } The type to test against.
 * @param value { Any } The value to test against the type.
 * @return { boolean } Whether the value has the provided type.
 */
export const isType = curry((type, value) => type === 'array' ? Array.isArray(value) : typeof value === type);

/**
 * Deteremines if the provided value is undefined.
 * isUndefined : Any -> Boolean
 *
 * @param value { Undefined } The value to test.
 * @return { boolean } Whether or not the value is undefined.
 */
export const isUndefined = value => isType('undefined', value);

/**
 * Determines if the provided value is a blank value (undefined, null or an empty string).
 * isEmpty : Any -> Boolean
 *
 * @param value { Undefined, Null, or String } The value to test.
 * @return { boolean } Whether or not the value is blank.
 */
export const isEmpty = value => {
    return isUndefined(value)
        ||  value === null
        || (isType('string', value) && value.trim() === '')
        || (isType('array', value) && value.length === 0);
};

/**
 * Determines if the provided value is an object.
 * isObject : Any -> Boolean
 *
 * @param value { Object } The value to test.
 * @return { boolean } Whether or not the value is an object.
 */
export const isObject = value => isType('object', value) && ! Array.isArray(value);

/**
 * Determines if the provided value is an Object with properties.
 * isPopulatedObject : Any -> Boolean
 *
 * @param value { Object } The value to test.
 * @return { boolean } Whether or not the value is an object.
 */
export const isPopulatedObject = value => isObject(value) && Object.keys(value).length > 0;

/**
 * Determines if the provided value is an Object or undefined.
 * isUndefinedOrObject : Any -> Boolean
 *
 * @param value { Object } The value to test.
 * @return { boolean } Whether or not the value is an object or undefined.
 */
export const isObjectOrUndefined = value => isObject(value) || isUndefined(value);

/**
 * Determines if the passed value is a collection of populated objects.
 * arePopulatedObjects : Any -> Boolean
 *
 * @param value { Array<Object> } The value to test.
 * @return { boolean } Whether or not the value is a collection of populated objects.
 */
export const arePopulatedObjects = value =>
    Array.isArray(value) && value.length > 1 && value.every(isPopulatedObject);
