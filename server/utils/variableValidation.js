'use strict';

/**
 * Determines if the provided value is an object.
 * isObject : Any -> Boolean
 *
 * @param value { Object } The value to test.
 * @return { boolean } Whether or not the value is an object.
 */
export const isObject = value => typeof value === 'object' && ! Array.isArray(value);

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
export const isObjectOrUndefined = value => isObject(value) || typeof value === 'undefined';

/**
 * Determines if the passed value is a collection of populated objects.
 * arePopulatedObjects : Any -> Boolean
 *
 * @param value { Array<Object> } The value to test.
 * @return { boolean } Whether or not the value is a collection of populated objects.
 */
export const arePopulatedObjects = value =>
    Array.isArray(value) && value.length > 1 && value.every(isPopulatedObject);
