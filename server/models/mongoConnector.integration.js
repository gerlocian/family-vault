'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { should } from 'chai';
import MongoConnector from './mongoConnector';
import { MongoClient } from 'mongodb';
import model from './test.model.json';

should();
chai.use(chaiAsPromised);

describe('MongoConnector', () => {
    const testUrl = 'mongodb://localhost:27017/testdatabase';
    const testCollection = 'testcollection';

    let mongoConnector;
    let database;

    beforeEach(() => {
        mongoConnector = MongoConnector(MongoClient, testUrl, testCollection, model);

        return MongoClient.connect(testUrl).then(db => {
            database = db;
            return db.collection(testCollection).insertMany([
                { id: 1, fieldtype: 'type1' },
                { id: 2, fieldtype: 'type1' },
                { id: 3, fieldtype: 'type1' },
                { id: 4, fieldtype: 'type2' },
                { id: 5, fieldtype: 'type2' },
                { id: 6, fieldtype: 'type2' },
                { id: 7, fieldtype: 'type3' },
                { id: 8, fieldtype: 'type3' },
                { id: 9, fieldtype: 'type3' },
            ]);
        });
    });

    afterEach(() => {
        return database.collection(testCollection).deleteMany({}).then(() => database.close());
    });

    it('should be a function', () => {
        MongoConnector.should.be.a('function');
    });

    it('should still be a function after the client has been added', () => {
        MongoConnector(MongoClient).should.be.a('function');
    });

    it('should still be a function after client and url have been added', () => {
        MongoConnector(MongoClient, testUrl).should.be.a('function');
    });

    it('should still be a function after collection name is added', () => {
        MongoConnector(MongoClient, testUrl, testCollection).should.be.a('function');
    });

    it('should finally resolve to an object', () => {
        mongoConnector.should.be.a('object');
    });

    describe('count', () => {
        it('should exist', () => {
            mongoConnector.count.should.be.a('function');
        });

        it('should reject if given a string', (done) => {
            mongoConnector.count('string').should.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            mongoConnector.count(12345678).should.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            mongoConnector.count([ 1, 2 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            mongoConnector.count(true).should.be.rejected.notify(done);
        });

        it('should find all documents if no query is given', (done) => {
            mongoConnector.count().should.eventually.equal(9).notify(done);
        });

        it('should find the appropriate documents with a query', (done) => {
            mongoConnector.count({ fieldtype: 'type1' }).should.eventually.equal(3).notify(done);
        });
    });

    describe('insertOne', () => {
        it('should exist', () => {
            mongoConnector.insertOne.should.be.a('function');
        });

        it('should reject if given a string', (done) => {
            mongoConnector.insertOne('string').should.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            mongoConnector.insertOne(12345678).should.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            mongoConnector.insertOne([ 1, 2 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            mongoConnector.insertOne(true).should.be.rejected.notify(done);
        });

        it('should validate the provided document against the model given to the factory', (done) => {
            mongoConnector.insertOne({ a:1 }).should.be.rejected.notify(done);
        });

        it('should test that the document fields are all there and the correct types', (done) => {
            mongoConnector.insertOne({ fieldtype: 1 }).should.be.rejected.notify(done);
        });

        it('should insert a document into the database', (done) => {
            mongoConnector.insertOne({ id: 11, fieldtype: 'type1' }).then(() => {
                database.collection(testCollection).count({})
                    .should.eventually.equal(10).notify(done);
            }).catch(err => { done(new Error(err)); });
        });
    });

    describe('insertMany', () => {
        it('should exist', () => {
            mongoConnector.insertMany.should.be.a('function');
        });

        it('should reject if given an object', (done) => {
            mongoConnector.insertMany({ a:1 }).should.be.rejected.notify(done);
        });

        it('should reject if given a string', (done) => {
            mongoConnector.insertMany('string').should.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            mongoConnector.insertMany(12345678).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            mongoConnector.insertMany(true).should.be.rejected.notify(done);
        });

        it('should reject if given an array with non-objects', (done) => {
            const docs = [
                { id: 10, fieldtype: 'type1' },
                { id: 11, fieldtype: 'type1' },
                'string'
            ];
            mongoConnector.insertMany(docs).should.be.rejected.notify(done);
        });

        it('should reject if given a collection of one document', (done) => {
            mongoConnector.insertMany([{ a:1 }]).should.be.rejected.notify(done);
        });

        it('should validate the provided documents against the model given to the factory', (done) => {
            mongoConnector.insertMany([
                { a:1 }, { a:2 }, { a:3 }
            ]).should.be.rejected.notify(done);
        });

        it('should test that the document fields are all there and the correct types', (done) => {
            mongoConnector.insertMany([
                { fieldtype: 1 }, { fieldtype: true }, { fieldtype: 'hello' }
            ]).should.be.rejected.notify(done);
        });

        it('should insert many records into the database', (done) => {
            mongoConnector.insertMany([
                { id: 10, fieldtype: 'type1' },
                { id: 11, fieldtype: 'type1' },
                { id: 12, fieldtype: 'type1' }
            ]).then(() => {
                database.collection(testCollection).count({})
                    .should.eventually.equal(12).notify(done);
            });
        });
    });

    describe('deleteMany', () => {
        it('should exist', () => {
            mongoConnector.deleteMany.should.be.a('function');
        });

        it('should reject if given a string', (done) => {
            mongoConnector.deleteMany('string').should.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            mongoConnector.deleteMany(12345678).should.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            mongoConnector.deleteMany([ 1, 2 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            mongoConnector.deleteMany(true).should.be.rejected.notify(done);
        });

        it('should delete the appropriate documents with a query', (done) => {
            mongoConnector.deleteMany({ fieldtype: 'type1' }).then(() => {
                database.collection(testCollection).count({})
                    .should.eventually.equal(6).notify(done);
            });
        });
    });

    describe('deleteOne', () => {
        it('should exist', () => {
            mongoConnector.deleteOne.should.be.a('function');
        });

        it('should reject if given a string', (done) => {
            mongoConnector.deleteOne('string').should.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            mongoConnector.deleteOne(12345678).should.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            mongoConnector.deleteOne([ 1, 2 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            mongoConnector.deleteOne(true).should.be.rejected.notify(done);
        });

        it('should delete the appropriate documents with a query', (done) => {
            mongoConnector.deleteOne({ fieldtype: 'type1' }).then(() => {
                database.collection(testCollection).count({})
                    .should.eventually.equal(8).notify(done);
            });
        });
    });

    describe('deleteOneById', () => {
        it('should exist', () => {
            mongoConnector.deleteOneById.should.be.a('function');
        });

        it('should reject if given an object', (done) => {
            mongoConnector.deleteOneById({ id: 1 }).should.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            mongoConnector.deleteOneById([ 1 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            mongoConnector.deleteOneById(1).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            mongoConnector.deleteOneById(true).should.be.rejected.notify(done);
        });

        it('should reduce document count by one when given a valid id value', (done) => {
            database.collection(testCollection).findOne({ fieldtype: 'type1' }).then(doc => {
                mongoConnector.deleteOneById(doc._id.toString()).then(() => {
                    database.collection(testCollection).count({})
                        .should.eventually.equal(8).notify(done);
                });
            });
        });

        it('should delete the first document when given a valid id value', (done) => {
            database.collection(testCollection).findOne({ fieldtype: 'type1' }).then(doc => {
                mongoConnector.deleteOneById(doc._id.toString()).then(() => {
                    database.collection(testCollection).find({ fieldtype: 'type1' }).toArray().then(docs => {
                        const nDocs = docs.map(doc => ({ id: doc.id, fieldtype: doc.fieldtype }));
                        nDocs.should.not.include({ id: 1, fieldtype: 'type1' });
                    }).should.notify(done);
                });
            });
        });
    });

    describe('find', () => {
        it('should exist', () => {
            mongoConnector.find.should.be.a('function');
        });

        it('should reject if given a string', (done) => {
            mongoConnector.find('string').should.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            mongoConnector.find(12345678).should.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            mongoConnector.find([ 1, 2 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            mongoConnector.find(true).should.be.rejected.notify(done);
        });

        it('should find the appropriate documents with a query', (done) => {
            mongoConnector.find({ fieldtype: 'type1' }).should.eventually.have.length(3).notify(done);
        });
    });

    describe('findOne', () => {
        it('should exist', () => {
            mongoConnector.findOne.should.be.a('function');
        });

        it('should reject if given a string', (done) => {
            mongoConnector.findOne('string').should.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            mongoConnector.findOne(12345678).should.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            mongoConnector.findOne([ 1, 2 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            mongoConnector.findOne(true).should.be.rejected.notify(done);
        });

        it('should find the appropriate documents with a query', (done) => {
            mongoConnector.findOne({ fieldtype: 'type1' })
                .should.eventually.have.property('id', 1).notify(done);
        });
    });

    describe('findOneById', () => {
        it('should exist', () => {
            mongoConnector.findOneById.should.be.a('function');
        });

        it('should reject if given an object', (done) => {
            mongoConnector.findOneById({ id: 1 }).should.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            mongoConnector.findOneById([ 1 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            mongoConnector.findOneById(1).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            mongoConnector.findOneById(true).should.be.rejected.notify(done);
        });

        it('should find the appropriate document when given a valid id value', (done) => {
            database.collection(testCollection).findOne({ fieldtype: 'type1' }).then(doc => {
                mongoConnector.findOneById(doc._id.toString())
                    .should.eventually.deep.equal(doc).notify(done);
            });
        });
    });

    describe('replaceOne', () => {
        it('should exist', () => {
            mongoConnector.replaceOne.should.be.a('function');
        });

        it('should reject if given a string for query', (done) => {
            mongoConnector.replaceOne('string').should.be.rejected.notify(done);
        });

        it('should reject if given a number for query', (done) => {
            mongoConnector.replaceOne(12345678).should.be.rejected.notify(done);
        });

        it('should reject if given an array for query', (done) => {
            mongoConnector.replaceOne([ 1, 2 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean for query', (done) => {
            mongoConnector.replaceOne(true).should.be.rejected.notify(done);
        });

        it('should reject if given a string for document', (done) => {
            mongoConnector.replaceOne({}, 'string').should.be.rejected.notify(done);
        });

        it('should reject if given a number for document', (done) => {
            mongoConnector.replaceOne({}, 12345678).should.be.rejected.notify(done);
        });

        it('should reject if given an array for document', (done) => {
            mongoConnector.replaceOne({}, [ 1, 2 ]).should.be.rejected.notify(done);
        });

        it('should reject if given a boolean for document', (done) => {
            mongoConnector.replaceOne({}, true).should.be.rejected.notify(done);
        });

        it('should validate the provided document against the model given to the factory', (done) => {
            mongoConnector.replaceOne({}, { a:1 }).should.be.rejected.notify(done);
        });

        it('should test that the document fields are all there and the correct types', (done) => {
            mongoConnector.replaceOne({}, { fieldtype: 1 }).should.be.rejected.notify(done);
        });

        it('should replace the found document with a new document', (done) => {
            const newDocument = { id: 1, fieldtype: 'type4' };

            mongoConnector.replaceOne({ id: 1 }, newDocument).then(() => {
                const test = database.collection(testCollection).findOne({ id: 1 });
                test.should.eventually.have.property('fieldtype', 'type4').notify(done);
            });
        });
    });
});
