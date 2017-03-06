'use strict';

import curry from 'lodash/curry';
import documentConverter from './documentConverter';
import * as assert from './../utils/variableValidation';
import { ObjectID } from 'mongodb';

/**
 * An abstract class for any data models in the system.
 *
 * @param client { MongoClient } Expected to be either a MongoClient object or a mock.
 * @param url { string } The connection string to the Mongo database.
 * @param collectionName { string } The name of the collection the intended model is to use.
 * @returns { Object } The model object.
 */
function MongoConnector(client, url, collectionName, model) {

    /**
     * Processes the document and makes sure that it conforms to the given mode.
     * normalizeDocument : Object -> Object
     *
     * @param document { Object } The document object to normalize.
     * @return { Object } An object containing either the normalized document, or errors.
     */
    const normalizeDocument = documentConverter(model);

    /**
     * Processes actions against the model.
     * processAction : Function -> Promise
     *
     * @param action { Function } The action to perform on the model.
     * @return { Promise } The promise object generated for the action.
     */
    function processAction(action) {
        return client.connect(
            url
        ).then(db => {
            const result = action(db);
            return {db, result};
        }).then(p => {
            p.db.close();
            return p.result;
        });
    }

    /**
     * Counts the number of documents that match a given query.
     * count : Object -> Promise
     *
     * @param query { Object } The query to use to find the documents we want to count.
     * @return { Promise } The promise object created after the count.
     */
    function count(query) {
        return assert.isObjectOrUndefined(query)
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
        return assert.isPopulatedObject(query)
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
        return assert.isPopulatedObject(query)
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
        return assert.isObjectOrUndefined(query)
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
        return assert.isObjectOrUndefined(query)
            ? processAction(db => db.collection(collectionName).findOne(query))
            : Promise.reject('findOne: You must provide a valid search query.');
    }

    /**
     * Finds the first instance of a document that matches the provided document id. This document
     * id is the one assigned to the document by the mongo system.
     * findOneById : String -> Promise
     *
     * @param id { String } The document id to use for the query.
     * @return { Promise } The promise object created for the document found.
     */
    function findOneById(id) {
        return assert.isType('string', id)
            ? processAction(db => db.collection(collectionName).findOne({ _id: new ObjectID(id) }))
            : Promise.reject('findOneById: You must provide a valid id string.');
    }

    /**
     * Inserts a document into the collection.
     * insertOne : Object -> Promise
     *
     * @param document { Object } The document to insert.
     * @return { Promise } The promise object created after the insertion.
     */
    function insertOne(document) {
        const nDocument = normalizeDocument(document);

        if (nDocument.errors.length > 0)
            return Promise.reject(nDocument);

        return processAction(db => db.collection(collectionName).insertOne(nDocument.document));
    }

    /**
     * Inserts many documents into the collection.
     * insertMany : Array<Object> : Promise
     *
     * @param documents { Array<Object> } The documents to insert.
     * @return { Promise } The promise object created after the insertions.
     */
    function insertMany(documents) {
        if (! assert.arePopulatedObjects(documents))
            return Promise.reject('insertMany: All documents in the array must be populated objects');

        const nDocuments = documents.map(doc => normalizeDocument(doc));

        if (nDocuments.some(doc => doc.errors.length > 0))
            return Promise.reject(nDocuments);

        return processAction(db => db.collection(collectionName).insertMany(documents));
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
        const nDocument = normalizeDocument(document);

        if (nDocument.errors.length > 0)
            return Promise.reject(nDocument);

        return processAction(db => db.collection(collectionName).replaceOne(query, nDocument.document));
    }

    /* TODO: Add updateOne method to make PATCH requests easier */

    return {
        count,
        deleteMany,
        deleteOne,
        find,
        findOne,
        findOneById,
        insertOne,
        insertMany,
        replaceOne
    };
}

export default curry(MongoConnector);
