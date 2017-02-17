'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import MongoConnector from './mongoConnector';
import { MongoClient } from 'mongodb';

chai.use(chaiAsPromised);

describe('MongoConnector', () => {
    const testUrl = 'mongodb://localhost:27017/testdatabase';
    const testCollection = 'testcollection';

    let mongoConnector;
    let database;

    beforeEach(() => {
        mongoConnector = MongoConnector(MongoClient, testUrl, testCollection);

        return MongoClient.connect(testUrl).then(db => {
            database = db;
            return db.collection(testCollection).insertMany([
                { id: 1, type: 'type1' },
                { id: 2, type: 'type1' },
                { id: 3, type: 'type1' },
                { id: 4, type: 'type2' },
                { id: 5, type: 'type2' },
                { id: 6, type: 'type2' },
                { id: 7, type: 'type3' },
                { id: 8, type: 'type3' },
                { id: 9, type: 'type3' },
            ]);
        });
    });

    afterEach(() => {
        return database.collection(testCollection).deleteMany({}).then(() => database.close());
    });

    it('should exist', () => {
        expect(mongoConnector).to.exist;
    });

    describe('count', () => {
        it('should exist', () => {
            expect(mongoConnector.count).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(mongoConnector.count('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(mongoConnector.count(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(mongoConnector.count([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(mongoConnector.count(true)).to.be.rejected.notify(done);
        });

        it('should find all documents if no query is given', (done) => {
            expect(mongoConnector.count()).to.eventually.equal(9).notify(done);
        });

        it('should find the appropriate documents with a query', (done) => {
            expect(mongoConnector.count({ type: 'type1' })).to.eventually.equal(3).notify(done);
        });
    });

    describe('insertOne', () => {
        it('should exist', () => {
            expect(mongoConnector.insertOne).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(mongoConnector.insertOne('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(mongoConnector.insertOne(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(mongoConnector.insertOne([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(mongoConnector.insertOne(true)).to.be.rejected.notify(done);
        });

        it('should insert a document into the database', (done) => {
            mongoConnector.insertOne({
                a: 1,
                test: 'insertOne',
                take: 1
            }).then(() => {
                expect(database.collection(testCollection).count({}))
                    .to.eventually.equal(10).notify(done);
            });
        });
    });

    describe('insertMany', () => {
        it('should exist', () => {
            expect(mongoConnector.insertMany).to.be.a('function');
        });

        it('should reject if given an object', (done) => {
            expect(mongoConnector.insertMany({ a:1 })).to.be.rejected.notify(done);
        });

        it('should reject if given a string', (done) => {
            expect(mongoConnector.insertMany('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(mongoConnector.insertMany(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(mongoConnector.insertMany(true)).to.be.rejected.notify(done);
        });

        it('should reject if given an array with non-objects', (done) => {
            const docs = [
                { a: 1 },
                { b: 2 },
                'string'
            ];
            expect(mongoConnector.insertMany(docs)).to.be.rejected.notify(done);
        });

        it('should reject if given a collection of one document', (done) => {
            const docs = [ { a: 1 } ];
            expect(mongoConnector.insertMany(docs)).to.be.rejected.notify(done);
        });

        it('should insert many records into the database', (done) => {
            mongoConnector.insertMany([
                { id: 1, type: 'type1' },
                { id: 2, type: 'type1' },
                { id: 3, type: 'type1' }
            ]).then(() => {
                expect(database.collection(testCollection).count({}))
                    .to.eventually.equal(12).notify(done);
            });
        });
    });

    describe('deleteMany', () => {
        it('should exist', () => {
            expect(mongoConnector.deleteMany).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(mongoConnector.deleteMany('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(mongoConnector.deleteMany(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(mongoConnector.deleteMany([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(mongoConnector.deleteMany(true)).to.be.rejected.notify(done);
        });

        it('should delete the appropriate documents with a query', (done) => {
            mongoConnector.deleteMany({ type: 'type1' }).then(() => {
                expect(database.collection(testCollection).count({}))
                    .to.eventually.equal(6).notify(done);
            });
        });
    });

    describe('deleteOne', () => {
        it('should exist', () => {
            expect(mongoConnector.deleteOne).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(mongoConnector.deleteOne('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(mongoConnector.deleteOne(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(mongoConnector.deleteOne([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(mongoConnector.deleteOne(true)).to.be.rejected.notify(done);
        });

        it('should delete the appropriate documents with a query', (done) => {
            mongoConnector.deleteOne({ type: 'type1' }).then(() => {
                expect(database.collection(testCollection).count({}))
                    .to.eventually.equal(8).notify(done);
            });
        });
    });

    describe('find', () => {
        it('should exist', () => {
            expect(mongoConnector.find).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(mongoConnector.find('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(mongoConnector.find(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(mongoConnector.find([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(mongoConnector.find(true)).to.be.rejected.notify(done);
        });

        it('should find the appropriate documents with a query', (done) => {
            expect(mongoConnector.find({ type: 'type1' })).to.eventually.have.length(3).notify(done);
        });
    });

    describe('findOne', () => {
        it('should exist', () => {
            expect(mongoConnector.findOne).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(mongoConnector.findOne('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(mongoConnector.findOne(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(mongoConnector.findOne([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(mongoConnector.findOne(true)).to.be.rejected.notify(done);
        });

        it('should find the appropriate documents with a query', (done) => {
            expect(mongoConnector.findOne({ type: 'type1' }))
                .to.eventually.have.property('id', 1).notify(done);
        });
    });

    describe('replaceOne', () => {
        it('should exist', () => {
            expect(mongoConnector.replaceOne).to.be.a('function');
        });

        it('should reject if given a string for query', (done) => {
            expect(mongoConnector.replaceOne('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number for query', (done) => {
            expect(mongoConnector.replaceOne(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array for query', (done) => {
            expect(mongoConnector.replaceOne([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean for query', (done) => {
            expect(mongoConnector.replaceOne(true)).to.be.rejected.notify(done);
        });

        it('should reject if given a string for document', (done) => {
            expect(mongoConnector.replaceOne({}, 'string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number for document', (done) => {
            expect(mongoConnector.replaceOne({}, 12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array for document', (done) => {
            expect(mongoConnector.replaceOne({}, [ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean for document', (done) => {
            expect(mongoConnector.replaceOne({}, true)).to.be.rejected.notify(done);
        });

        it('should replace the found document with a new document', (done) => {
            const newDocument = { id: 'x', type: 'type4', randomField: Math.random() };

            mongoConnector.replaceOne({ id: 1 }, newDocument).then(() => {
                expect(database.collection(testCollection).findOne({ id: 'x' }))
                    .to.eventually.have.property('randomField', newDocument.randomField).notify(done);
            });
        });
    });
});