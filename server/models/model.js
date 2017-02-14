'use strict';

/**
 * An abstract class for any data models in the system.
 * @param client { MongoClient } Expected to be either a MongoClient object or a mock.
 * @param collection { string } The name of the collection the intended model is to use.
 * @returns {{connect: connect}} The model object.
 */
function Model (client, url, collectionName) {

    /**
     * Determines if the provided value is an object.
     * @param value { variable } The value to test.
     * @return { boolean } Whether or not the value is an object.
     */
    const isObject = value => typeof value === 'object' && ! Array.isArray(value);

    /**
     * Determines if the provided value is an array.
     * @param value { variable } The value to test.
     * @return { boolean } Whether or not the value is an array.
     */
    const isArray = value => Array.isArray(value);

    /**
     * Counts the number of documents that match a given query.
     * @param query { Object } The query to use to find the documents we want to count.
     * @return { Promise } The promise object created after the count.
     */
    function count(query) {
        if (query && !isObject(query)) return Promise.reject('Provided query must be an object or undefined');

        return client.connect(url).then(db => {
            return db.collection(collectionName).count(query).then(num => {
                db.close();
                return num;
            });
        });
    }

    /**
     * Deletes a number of documents based on the given query.
     * @param query { Object } The query to use to find the documents to delete.
     * @return { Promise } The promise object created for the deletion.
     */
    function deleteMany(query) {
        if (!isObject(query)) return Promise.reject('You must provide a valid query for deleteMany.');

        return client.connect(url).then(db => {
            return db.collection(collectionName).deleteMany(query).then(response => {
                db.close();
                return response;
            });
        });
    }

    /**
     * Deletes the first instance of the matched documents based on the given query.
     * @param query { Object } The query to use to find the document to delete.
     * @return { Promise } The promise object created for the deletion.
     */
    function deleteOne(query) {
        if (!isObject(query)) return Promise.reject('You must provide a valid query for deleteOne.');

        return client.connect(url).then(db => {
            return db.collection(collectionName).deleteOne(query).then(response => {
                db.close();
                return response;
            });
        });
    }

    /**
     * Finds any number of documents that match a given query.
     * @param query ( Object } The query to use to find the documents.
     * @return { Promise } The promise object created for the documents found.
     */
    function find(query) {
        if (!isObject(query)) return Promise.reject('You must provide a valid search query.');

        return client.connect(url).then(db => {
            return db.collection(collectionName).find(query).toArray().then(response => {
                db.close();
                return response;
            });
        });
    }

    /**
     * Inserts a document into the collection.
     * @param document { Object } The document to insert.
     * @return { Promise } The promise object created after the insertion.
     */
    function insertOne(document) {
        if (!isObject(document)) return Promise.reject('Document must be an object');

        return client.connect(url).then(db => {
            return db.collection(collectionName).insertOne(document).then(response => {
                db.close();
                return response;
            });
        });
    }

    /**
     * Inserts many documents into the collection.
     * @param documents { Array<Object> } The documents to insert.
     * @return { Promise } The promise object created after the insertions.
     */
    function insertMany(documents) {
        if (!isArray(documents)) return Promise.reject('You must provide an array of documents.');

        if (documents.length < 2) return Promise.reject('Documents must be more than 1. For 1 document, use insertOne instead.');

        if (documents.filter(isObject).length !== documents.length)
            return Promise.reject('All documents in the array must be objects.');

        return client.connect(url).then(db => {
            return db.collection(collectionName).insertMany(documents).then(response => {
                db.close();
                return response;
            });
        });
    }

    return {
        count,
        deleteMany,
        deleteOne,
        find,
        insertOne,
        insertMany
    };
}

export default Model;
