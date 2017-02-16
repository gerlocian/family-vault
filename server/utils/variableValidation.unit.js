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
            tests.noValue
                ? expect(func()).to.be.true
                : expect(func()).to.be.false;
        });

        it(`should return ${tests.emptyObject} for an empty object`, () => {
            tests.emptyObject
                ? expect(func({})).to.be.true
                : expect(func({})).to.be.false;
        });

        it(`should return ${tests.populatedObject} for a populated object`, () => {
            tests.populatedObject
                ? expect(func({ a:1 })).to.be.true
                : expect(func({ a:1 })).to.be.false;
        });

        it(`should return ${tests.emptyArray} for an empty array`, () => {
            tests.emptyArray
                ? expect(func([])).to.be.true
                : expect(func([])).to.be.false;
        });

        it(`should return ${tests.oneValueArrayNoObject} for a populated array of one value (no object)`, () => {
            tests.oneValueArrayNoObject
                ? expect(func([ 1 ])).to.be.true
                : expect(func([ 1 ])).to.be.false;
        });

        it(`should return ${tests.manyValueArrayNoObject} for a populated array with more than 1 value (no objects)`, () => {
            tests.manyValueArrayNoObject
                ? expect(func([ 1, 2, 3 ])).to.be.true
                : expect(func([ 1, 2, 3 ])).to.be.false;
        });

        it(`should return ${tests.oneValueArrayWithEmptyObject} for a populated array of one value (object)`, () => {
            tests.oneValueArrayWithEmptyObject
                ? expect(func([ {} ])).to.be.true
                : expect(func([ {} ])).to.be.false;
        });

        it(`should return ${tests.manyValueArrayWithEmptyObject} for a populated array with more than 1 value (objects)`, () => {
            tests.manyValueArrayWithEmptyObject
                ? expect(func([ {}, {}, {} ])).to.be.true
                : expect(func([ {}, {}, {} ])).to.be.false;
        });

        it(`should return ${tests.oneValueArrayWithPopulatedObject} for a populated array of one value ( populated object)`, () => {
            tests.oneValueArrayWithPopulatedObject
                ? expect(func([ { a:1 } ])).to.be.true
                : expect(func([ { a:1 } ])).to.be.false;
        });

        it(`should return ${tests.manyValueArrayWithPopulatedObject} for a populated array with more than 1 value (populated objects)`, () => {
            tests.manyValueArrayWithPopulatedObject
                ? expect(func([ { a:1 }, { b:2 }, { c:3 } ])).to.be.true
                : expect(func([ { a:1 }, { b:2 }, { c:3 } ])).to.be.false;
        });

        it(`should return ${tests.number} for a number`, () => {
            tests.number
                ? expect(func(1)).to.be.true
                : expect(func(1)).to.be.false;
        });

        it(`should return ${tests.string} for a string`, () => {
            tests.string
                ? expect(func('a')).to.be.true
                : expect(func('a')).to.be.false;
        });

        it(`should return ${tests.boolean} for a boolean`, () => {
            tests.boolean
                ? expect(func(true)).to.be.true
                : expect(func(true)).to.be.false;
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


