'use strict';

import { expect } from 'chai';
import { isObject, isPopulatedObject, isObjectOrUndefined, arePopulatedObjects }
    from './variableValidation';


// TODO Complete me.

/**
 * Tests a given function against the requested tests.
 * @param func { Function } The function to test.
 * @param trueTests { Object } The tests to run.
 */
const runTests = (func, trueTests) => {
    const tests = Object.assign({}, {
        noValue: false,
        emptyObject: false,
        populatedObject: false,
        emptyArray: false,
        oneValueArrayNoObject: false,
        manyValueArrayNoObject: false,
        oneValueArrayWithEmptyObject: false,
        manyValueArrayWithEmptyObject: false,
        oneValueArrayWithPopulatedObject: false,
        manyValueArrayWithPopulatedObject: false,
        number: false,
        string: false,
        boolean: false
    }, trueTests);

    describe(func.name, () => {
        it('should exist', () => {
            expect(func).to.be.a('function');
        });

        it(`should return ${tests.noValue} for no value or undefined`, () => {
            expect(func()).to.equal(tests.noValue);
        });

        it(`should return ${tests.emptyObject} for an empty object`, () => {
            expect(func({})).to.equal(tests.emptyObject);
        });

        it(`should return ${tests.populatedObject} for a populated object`, () => {
            expect(func({ a:1 })).to.equal(tests.populatedObject);
        });

        it(`should return ${tests.emptyArray} for an empty array`, () => {
            expect(func([])).to.equal(tests.emptyArray);
        });

        it(`should return ${tests.oneValueArrayNoObject} for a populated array of one value (no object)`, () => {
            expect(func([ 1 ])).to.equal(tests.oneValueArrayNoObject);
        });

        it(`should return ${tests.manyValueArrayNoObject} for a populated array with more than 1 value (no objects)`, () => {
            expect(func([ 1, 2, 3 ])).to.equal(tests.manyValueArrayNoObject);
        });

        it(`should return ${tests.oneValueArrayWithEmptyObject} for a populated array of one value (object)`, () => {
            expect(func([ {} ])).to.equal(tests.oneValueArrayWithEmptyObject);
        });

        it(`should return ${tests.manyValueArrayWithEmptyObject} for a populated array with more than 1 value (objects)`, () => {
            expect(func([ {}, {}, {} ])).to.equal(tests.manyValueArrayWithEmptyObject);
        });

        it(`should return ${tests.oneValueArrayWithPopulatedObject} for a populated array of one value ( populated object)`, () => {
            expect(func([ { a:1 } ])).to.equal(tests.oneValueArrayWithPopulatedObject);
        });

        it(`should return ${tests.manyValueArrayWithPopulatedObject} for a populated array with more than 1 value (populated objects)`, () => {
            expect(func([ { a:1 }, { b:2 }, { c:3 } ])).to.equal(tests.manyValueArrayWithPopulatedObject);
        });

        it(`should return ${tests.number} for a number`, () => {
            expect(func(1)).to.equal(tests.number);
        });

        it(`should return ${tests.string} for a string`, () => {
            expect(func('a')).to.equal(tests.string);
        });

        it(`should return ${tests.boolean} for a boolean`, () => {
            expect(func(true)).to.equal(tests.boolean);
        });
    });
};

runTests(isObject, {
    emptyObject: true,
    populatedObject: true
});

runTests(isPopulatedObject, {
    populatedObject: true
});

runTests(isObjectOrUndefined, {
    noValue: true,
    emptyObject: true,
    populatedObject: true
});

runTests(arePopulatedObjects, {
    manyValueArrayWithPopulatedObject: true
});


