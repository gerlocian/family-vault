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
    });

    afterEach(() => {
        return MongoClient.connect(testUrl).then(db => {
            return db.collection(testCollection).deleteMany({}).then(() => {
                db.close();
            });
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

        it('should insert a document into the database', (done) => {
            model.insertOne({
                a: 1,
                test: 'insertOne',
                take: 1
            }).then(() => {
                MongoClient.connect(testUrl).then(db => {
                    expect(
                        db.collection(testCollection).count()
                    ).to.eventually.equal(1).notify(done);
                });
            });
        });
    });
});
