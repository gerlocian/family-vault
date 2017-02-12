'use strict';

/**
 * An abstract class for any data models in the system.
 * @param client { MongoClient } Expected to be either a MongoClient object or a mock.
 * @param collection { string } The name of the collection the intended model is to use.
 * @returns {{connect: connect}} The model object.
 */
function Model (client, url, collectionName) {

    /**
     * Connects to the MongoClient and makes sure the connection was completed. If connection is
     * successful, then the success callback is called with the db object. Else, the failure is
     * called with the error data.
     * @param success { Function } The success callback for successful connection.
     * @param failure { Function } The failure callback for failed connections.
     */
    function connectAndProcess(success, failure) {
        client.connect(url, (err, db) => {
            if (err) {
                failure(err);
                return;
            }

            success(db);
        });
    }

    /**
     * Counts the number of documents in the collection given a specific query. If the query is
     * undefined, then this method counts all the documents in the collection.
     * @param query { Object || undefined } The query for finding the documents to count.
     * @param success { Function } The callback after a successful count.
     * @param failure { Function } The callback after a failed count. (Includes db connect issues)
     */
    function count(query, success, failure) {
        function connectSuccess(db) {
            db.collection(collectionName).count(query).then(success).catch(failure);
            db.close();
        }

        connectAndProcess(connectSuccess, failure);
    }

    function deleteMany() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function deleteOne() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function find() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function findOne() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function findOneAndDelete() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function findOneAndReplace() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function findOneAndUpdate() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function insertMany() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function insertOne() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function replaceOne() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function updateMany() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    function updateOne() {
        connectAndProcess((db) => {
            db.collection(collectionName);
        });
    }

    return {
        count,
        deleteMany,
        deleteOne,
        find,
        findOne,
        findOneAndDelete,
        findOneAndReplace,
        findOneAndUpdate,
        insertMany,
        insertOne,
        replaceOne,
        updateMany,
        updateOne
    };
}

export default Model;
