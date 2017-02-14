'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import Model from './model';
import { MongoClient } from 'mongodb';

chai.use(chaiAsPromised);

describe('Model', () => {
    const testUrl = 'mongodb://localhost:27017/testdatabase';
    const testCollection = 'testcollection';

    let model;

    beforeEach(() => {
        model = Model(MongoClient, testUrl, testCollection);

        return MongoClient.connect(testUrl).then(db => {
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
            ]).then(() => db.close());
        });
    });

    afterEach(() => {
        return MongoClient.connect(testUrl).then(db => {
            return db.collection(testCollection).deleteMany({}).then(() => db.close());
        });
    });

    it('should exist', () => {
        expect(model).to.exist;
    });

    describe('insertOne', () => {
        it('should exist', () => {
            expect(model.insertOne).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(model.insertOne('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(model.insertOne(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(model.insertOne([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(model.insertOne(true)).to.be.rejected.notify(done);
        });

        it('should insert a document into the database', (done) => {
            model.insertOne({
                a: 1,
                test: 'insertOne',
                take: 1
            }).then(() => {
                MongoClient.connect(testUrl).then(db => {
                    expect(
                        db.collection(testCollection).count()
                    ).to.eventually.equal(10).notify(done);
                });
            });
        });
    });

    describe('insertMany', () => {
        it('should exist', () => {
            expect(model.insertMany).to.be.a('function');
        });

        it('should reject if given an object', (done) => {
            expect(model.insertMany({ a:1 })).to.be.rejected.notify(done);
        });

        it('should reject if given a string', (done) => {
            expect(model.insertMany('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(model.insertMany(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(model.insertMany(true)).to.be.rejected.notify(done);
        });

        it('should reject if given an array with non-objects', (done) => {
            const docs = [
                { a: 1 },
                { b: 2 },
                'string'
            ];
            expect(model.insertMany(docs)).to.be.rejected.notify(done);
        });

        it('should reject if given a collection of one document', (done) => {
            const docs = [ { a: 1 } ];
            expect(model.insertMany(docs)).to.be.rejected.notify(done);
        });

        it('should insert many records into the database', (done) => {
            model.insertMany([
                { id: 1, type: 'type1' },
                { id: 2, type: 'type1' },
                { id: 3, type: 'type1' }
            ]).then(() => {
                MongoClient.connect(testUrl).then(db => {
                    expect(
                        db.collection(testCollection).count()
                    ).to.eventually.equal(12).notify(done);
                });
            });
        });
    });

    describe('count', () => {
        it('should exist', () => {
            expect(model.count).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(model.count('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(model.count(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(model.count([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(model.count(true)).to.be.rejected.notify(done);
        });

        it('should find all documents if no query is given', (done) => {
            expect(model.count()).to.eventually.equal(9).notify(done);
        });

        it('should find the appropriate documents with a query', (done) => {
            expect(model.count({ type: 'type1' })).to.eventually.equal(3).notify(done);
        });
    });

    describe('deleteMany', () => {
        it('should exist', () => {
            expect(model.deleteMany).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(model.deleteMany('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(model.deleteMany(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(model.deleteMany([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(model.deleteMany(true)).to.be.rejected.notify(done);
        });

        it('should delete the appropriate documents with a query', (done) => {
            model.deleteMany({ type: 'type1' }).then(() => {
                MongoClient.connect(testUrl).then(db => {
                    expect(db.collection(testCollection).count()).to.eventually.equal(6).notify(done);
                });
            });
        });
    });

    describe('deleteOne', () => {
        it('should exist', () => {
            expect(model.deleteOne).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(model.deleteOne('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(model.deleteOne(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(model.deleteOne([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(model.deleteOne(true)).to.be.rejected.notify(done);
        });

        it('should delete the appropriate documents with a query', (done) => {
            model.deleteOne({ type: 'type1' }).then(() => {
                MongoClient.connect(testUrl).then(db => {
                    expect(db.collection(testCollection).count()).to.eventually.equal(8).notify(done);
                });
            });
        });
    });

    describe('find', () => {
        it('should exist', () => {
            expect(model.find).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(model.find('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(model.find(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(model.find([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(model.find(true)).to.be.rejected.notify(done);
        });

        it('should find the appropriate documents with a query', (done) => {
            expect(model.find({ type: 'type1' })).to.eventually.have.length(3).notify(done);
        });
    });

    describe('findOne', () => {
        it('should exist', () => {
            expect(model.findOne).to.be.a('function');
        });

        it('should reject if given a string', (done) => {
            expect(model.findOne('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number', (done) => {
            expect(model.findOne(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array', (done) => {
            expect(model.findOne([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean', (done) => {
            expect(model.findOne(true)).to.be.rejected.notify(done);
        });

        it('should find the appropriate documents with a query', (done) => {
            expect(model.findOne({ type: 'type1' })).to.eventually.have.property('id', 1).notify(done);
        });
    });

    describe('replaceOne', () => {
        it('should exist', () => {
            expect(model.replaceOne).to.be.a('function');
        });

        it('should reject if given a string for query', (done) => {
            expect(model.replaceOne('string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number for query', (done) => {
            expect(model.replaceOne(12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array for query', (done) => {
            expect(model.replaceOne([ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean for query', (done) => {
            expect(model.replaceOne(true)).to.be.rejected.notify(done);
        });

        it('should reject if given a string for document', (done) => {
            expect(model.replaceOne({}, 'string')).to.be.rejected.notify(done);
        });

        it('should reject if given a number for document', (done) => {
            expect(model.replaceOne({}, 12345678)).to.be.rejected.notify(done);
        });

        it('should reject if given an array for document', (done) => {
            expect(model.replaceOne({}, [ 1, 2 ])).to.be.rejected.notify(done);
        });

        it('should reject if given a boolean for document', (done) => {
            expect(model.replaceOne({}, true)).to.be.rejected.notify(done);
        });

        it('should replace the found document with a new document', (done) => {
            const newDocument = { id: 'x', type: 'type4', randomField: Math.random() };

            model.replaceOne({ id: 1 }, newDocument).then(() => {
                MongoClient.connect(testUrl).then(db => {
                    expect(db.collection(testCollection).findOne({ id: 'x' }))
                        .to.eventually.have.property('randomField', newDocument.randomField).notify(done);
                });
            });
        });
    });
});
