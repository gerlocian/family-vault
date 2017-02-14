'use strict';

/**
 * An abstract class for any data models in the system.
 *
 * @param client { MongoClient } Expected to be either a MongoClient object or a mock.
 * @param url { string } The connection string to the Mongo database.
 * @param collectionName { string } The name of the collection the intended model is to use.
 * @returns { Object } The model object.
 */
function Model (client, url, collectionName) {

    /**
     * Determines if the provided value is an object.
     * isObject : Any -> Boolean
     *
     * @param value { Object } The value to test.
     * @return { boolean } Whether or not the value is an object.
     */
    function isObject(value) {
        return typeof value === 'object' && ! Array.isArray(value);
    }

    /**
     * Determines if the provided value is an Object with properties.
     * isPopulatedObject : Any -> Boolean
     *
     * @param value { Object } The value to test.
     * @return { boolean } Whether or not the value is an object.
     */
    function isPopulatedObject(value) {
        return isObject(value) && Object.keys(value).length > 0;
    }

    /**
     * Determines if the provided value is an Object or undefined.
     * isUndefinedOrObject : Any -> Boolean
     *
     * @param value { Object } The value to test.
     * @return { boolean } Whether or not the value is an object or undefined.
     */
    function isObjectOrUndefined(value) {
        return isObject(value) || typeof value === 'undefined';
    }

    /**
     * Determines if the passed value is a collection of populated objects.
     * arePopulatedObjects : Any -> Boolean
     *
     * @param value { Array<Object> } The value to test.
     * @return { boolean } Whether or not the value is a collection of populated objects.
     */
    function arePopulatedObjects(value) {
        return Array.isArray(value)
            && value.length > 1
            && value.filter(isPopulatedObject).length === value.length;
    }

    /**
     * Processes actions against the model.
     * processAction : Function -> Promise
     *
     * @param action { Function } The action to perform on the model.
     * @return { Promise } The promise object generated for the action.
     */
    const processAction = action => {
        return client.connect(
            url
        ).then(db => {
            const result = action(db);
            return { db, result };
        }).then(results => {
            results.db.close();
            return results.result;
        });
    };

    /**
     * Counts the number of documents that match a given query.
     * count : Object -> Promise
     *
     * @param query { Object } The query to use to find the documents we want to count.
     * @return { Promise } The promise object created after the count.
     */
    function count(query) {
        return isObjectOrUndefined(query)
            ? processAction(db => db.collection(collectionName).count(query))
            : Promise.reject('count: Provided query must be an object or undefined');
    }

    /**
     * Deletes a number of documents based on the given query.
     * deleteMany : Object -> Promise
     *
     * @param query { Object } The query to use to find the documents to delete.
     * @return { Promise } The promise object created for the deletion.
     */
    function deleteMany(query) {
        return isPopulatedObject(query)
            ? processAction(db => db.collection(collectionName).deleteMany(query))
            : Promise.reject('deleteMany: You must provide a valid query for deleteMany.');
    }

    /**
     * Deletes the first instance of the matched documents based on the given query.
     * deleteOne : Object -> Promise
     *
     * @param query { Object } The query to use to find the document to delete.
     * @return { Promise } The promise object created for the deletion.
     */
    function deleteOne(query) {
        return isPopulatedObject(query)
            ? processAction(db => db.collection(collectionName).deleteOne(query))
            : Promise.reject('deleteOne: You must provide a valid query for deleteOne.');
    }

    /**
     * Finds any number of documents that match a given query.
     * find : Object -> Promise
     *
     * @param query ( Object } The query to use to find the documents.
     * @return { Promise } The promise object created for the documents found.
     */
    function find(query) {
        return isObjectOrUndefined(query)
            ? processAction(db => db.collection(collectionName).find(query).toArray())
            : Promise.reject('find: You must provide a valid search query.');
    }

    /**
     * Finds the first instance of a document that matches a given query.
     * findOne : Object -> Promise
     *
     * @param query ( Object } The query to use to find the document.
     * @return { Promise } The promise object created for the document found.
     */
    function findOne(query) {
        return isObjectOrUndefined(query)
            ? processAction(db => db.collection(collectionName).findOne(query))
            : Promise.reject('findOne: You must provide a valid search query.');
    }

    /**
     * Inserts a document into the collection.
     * insertOne : Object -> Promise
     *
     * @param document { Object } The document to insert.
     * @return { Promise } The promise object created after the insertion.
     */
    function insertOne(document) {
        return isPopulatedObject(document)
            ? processAction(db => db.collection(collectionName).insertOne(document))
            : Promise.reject('insertOne: Document must be an object');
    }

    /**
     * Inserts many documents into the collection.
     * insertMany : Array<Object> : Promise
     *
     * @param documents { Array<Object> } The documents to insert.
     * @return { Promise } The promise object created after the insertions.
     */
    function insertMany(documents) {
        return arePopulatedObjects(documents)
            ? processAction(db => db.collection(collectionName).insertMany(documents))
            : Promise.reject('insertMany: All documents in the array must be objects.');
    }

    /**
     * Replaces a single document with a new document.
     * replaceOne : Object -> Object -> Promise
     *
     * @param query { Object } The query to use to determine which document to replace.
     * @param document { Object } The replacement document.
     * @return { Promise } The promise created for this transaction.
     */
    function replaceOne(query, document) {
        return isPopulatedObject(query) && isPopulatedObject(document)
            ? processAction(db => db.collection(collectionName).replaceOne(query, document))
            : Promise.reject('replaceOne: Query and Document must be populated objects');
    }

    return {
        count,
        deleteMany,
        deleteOne,
        find,
        findOne,
        insertOne,
        insertMany,
        replaceOne
    };
}

export default Model;
