'use strict';

import chai from 'chai';
import * as td from 'testdouble';
import tdc from 'testdouble-chai';
import { expect } from 'chai';
import { MongoClient } from 'mongodb';
import Model from './model';

chai.use(tdc(td));

describe('Model', () => {
    const testUrl = 'mongodb://localhost:27017/collection';
    const collectionName = 'testCollection';

    const MockCollection = {};
    const MockDb = {};
    const MockMongoClient = td.object(MongoClient);

    let model;

    beforeEach(() => {
        // Setup mock chain.
        MockCollection.count = td.when(td.function()(td.matchers.anything())).thenResolve(4);
        MockDb.collection = td.when(td.function()(td.matchers.anything())).thenReturn(MockCollection);
        MockDb.close = td.function();
        MockMongoClient.connect = td.when(td.function()(testUrl)).thenCallback(undefined, MockDb);

        model = Model(MockMongoClient, testUrl, collectionName);
    });

    it('should exist', () => {
        expect(model).to.be.a('object');
    });

    it('should have all required methods', () => {
        const methods = [
            'count', 'deleteMany', 'deleteOne', 'find', 'findOne', 'findOneAndDelete', 'findOneAndReplace',
            'findOneAndUpdate', 'insertMany', 'insertOne', 'replaceOne', 'updateMany', 'updateOne'
        ];

        methods.forEach(
            (m) => expect(model[m]).to.be.a('function', `${m} is not a method on Model`)
        );
    });

    describe('count', () => {
        it('should call connect on the mongo client when called', () => {
            model.count();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });

        it('should handle connection failures', (done) => {
            const errorMessage = 'this is an error state';

            MockMongoClient.connect = td.when(td.function()(testUrl)).thenCallback(errorMessage);

            function failure(err) {
                expect(err).to.equal(errorMessage);
                done();
            }

            model.count(undefined, undefined, failure);
        });

        it('should handle counting failures', (done) => {
            const errorMessage = 'this is an error state';

            MockCollection.count = td.when(td.function()(td.matchers.anything())).thenReject(errorMessage);

            function failure(err) {
                expect(err).to.equal(errorMessage);
                done();
            }

            model.count(undefined, undefined, failure);
        });

        it('should get the count from the db', (done) => {
            const query = { a: 1 };

            function success (count) {
                expect(count).to.equal(4);
                done();
            }

            model.count(query, success);
            expect(MockCollection.count).to.have.been.calledWith(query);
            expect(MockDb.close).to.have.been.calledWith();
        });
    });

    describe('deleteMany', () => {
        it('should call connect on the mongo client when called', () => {
            model.deleteMany();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('deleteOne', () => {
        it('should call connect on the mongo client when called', () => {
            model.deleteOne();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('find', () => {
        it('should call connect on the mongo client when called', () => {
            model.find();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('findOne', () => {
        it('should call connect on the mongo client when called', () => {
            model.findOne();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('findOneAndDelete', () => {
        it('should call connect on the mongo client when called', () => {
            model.findOneAndDelete();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('findOneAndReplace', () => {
        it('should call connect on the mongo client when called', () => {
            model.findOneAndReplace();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('findOneAndUpdate', () => {
        it('should call connect on the mongo client when called', () => {
            model.findOneAndUpdate();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('insertMany', () => {
        it('should call connect on the mongo client when called', () => {
            model.insertMany();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('insertOne', () => {
        it('should call connect on the mongo client when called', () => {
            model.insertOne();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('replaceOne', () => {
        it('should call connect on the mongo client when called', () => {
            model.replaceOne();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('updateMany', () => {
        it('should call connect on the mongo client when called', () => {
            model.updateMany();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });

    describe('updateOne', () => {
        it('should call connect on the mongo client when called', () => {
            model.updateOne();
            expect(MockMongoClient.connect).to.have.been.calledWith(testUrl, td.matchers.isA(Function));
            expect(MockDb.collection).to.have.been.calledWith(collectionName);
        });
    });
});
