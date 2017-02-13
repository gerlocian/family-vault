'use strict';

/**
 * An abstract class for any data models in the system.
 * @param client { MongoClient } Expected to be either a MongoClient object or a mock.
 * @param collection { string } The name of the collection the intended model is to use.
 * @returns {{connect: connect}} The model object.
 */
function Model (client, url, collectionName) {

    /**
     * Inserts a document into the collection.
     * @param document { Object } The document to insert.
     * @return { Promise } The promise object created after the insertion.
     */
    function insertOne(document) {
        if (typeof document !== 'object')
            return Promise.reject('Document must be an object');

        return client.connect(url).then(db => {
            return db.collection(collectionName).insertOne(document).then(() => {
                db.close();
            });
        });
    }

    // /**
    //  * Counts the number of documents in the collection given a specific query. If the query is
    //  * undefined, then this method counts all the documents in the collection.
    //  * @param query { Object || undefined } The query for finding the documents to count.
    //  * @param success { Function } The callback after a successful count.
    //  * @param failure { Function } The callback after a failed count. (Includes db connect issues)
    //  */
    // function count(query, success, failure) {
    //     client.connect(url).then(db => {
    //         db.collection(collectionName).count(query).then(success).catch(failure);
    //         db.close();
    //     }).catch(failure);
    // }

    return {
        insertOne
    };
}

export default Model;
