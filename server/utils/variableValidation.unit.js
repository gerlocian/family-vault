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
        emptyObject: false
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

        it('should return false for a populated object', () => {
            expect(arePopulatedObjects({ a:1 })).to.be.false;
        });

        it('should return false for an empty array', () => {
            expect(arePopulatedObjects([])).to.be.false;
        });

        it('should return false for a populated array of one value (no object)', () => {
            expect(arePopulatedObjects([ 1 ])).to.be.false;
        });

        it('should return false for a populated array with more than 1 value (no objects)', () => {
            expect(arePopulatedObjects([ 1, 2, 3 ])).to.be.false;
        });

        it('should return false for a populated array of one value (object)', () => {
            expect(arePopulatedObjects([ {} ])).to.be.false;
        });

        it('should return false for a populated array with more than 1 value (objects)', () => {
            expect(arePopulatedObjects([ {}, {}, {} ])).to.be.false;
        });

        it('should return false for a populated array of one value ( populated object)', () => {
            expect(arePopulatedObjects([ { a:1 } ])).to.be.false;
        });

        it('should return true for a populated array with more than 1 value (populated objects)', () => {
            expect(arePopulatedObjects([ { a:1 }, { b:2 }, { c:3 } ])).to.be.true;
        });

        it('should return false for a number', () => {
            expect(arePopulatedObjects(1)).to.be.false;
        });

        it('should return false for a string', () => {
            expect(arePopulatedObjects('a')).to.be.false;
        });

        it('should return false for a boolean', () => {
            expect(arePopulatedObjects(true)).to.be.false;
        });
    });
};

describe('isObject', () => {
    it('should exist', () => {
        expect(isObject).to.be.a('function');
    });

    it('should return false for no value or undefined', () => {
        expect(isObject()).to.be.false;
    });

    it('should return true for an empty object', () => {
        expect(isObject({})).to.be.true;
    });

    it('should return true for a populated object', () => {
        expect(isObject({ a:1 })).to.be.true;
    });

    it('should return false for an empty array', () => {
        expect(isObject([])).to.be.false;
    });

    it('should return false for a populated array', () => {
        expect(isObject([ 1 ])).to.be.false;
    });

    it('should return false for a populated array with more than 1 value', () => {
        expect(isObject([ 1 ])).to.be.false;
    });

    it('should return false for a number', () => {
        expect(isObject(1)).to.be.false;
    });

    it('should return false for a string', () => {
        expect(isObject('a')).to.be.false;
    });

    it('should return false for a boolean', () => {
        expect(isObject(true)).to.be.false;
    });
});

describe('isPopulatedObject', () => {
    it('should exist', () => {
        expect(isPopulatedObject).to.be.a('function');
    });

    it('should return false for no value or undefined', () => {
        expect(isPopulatedObject()).to.be.false;
    });

    it('should return false for an empty object', () => {
        expect(isPopulatedObject({})).to.be.false;
    });

    it('should return true for a populated object', () => {
        expect(isPopulatedObject({ a:1 })).to.be.true;
    });

    it('should return false for an empty array', () => {
        expect(isPopulatedObject([])).to.be.false;
    });

    it('should return false for a populated array', () => {
        expect(isPopulatedObject([ 1 ])).to.be.false;
    });

    it('should return false for a populated array with more than 1 value', () => {
        expect(isPopulatedObject([ 1 ])).to.be.false;
    });

    it('should return false for a number', () => {
        expect(isPopulatedObject(1)).to.be.false;
    });

    it('should return false for a string', () => {
        expect(isPopulatedObject('a')).to.be.false;
    });

    it('should return false for a boolean', () => {
        expect(isPopulatedObject(true)).to.be.false;
    });
});

describe('isObjectOrUndefined', () => {
    it('should exist', () => {
        expect(isObjectOrUndefined).to.be.a('function');
    });

    it('should return true for no value or undefined', () => {
        expect(isObjectOrUndefined()).to.be.true;
    });

    it('should return true for an empty object', () => {
        expect(isObjectOrUndefined({})).to.be.true;
    });

    it('should return true for a populated object', () => {
        expect(isObjectOrUndefined({ a:1 })).to.be.true;
    });

    it('should return false for an empty array', () => {
        expect(isObjectOrUndefined([])).to.be.false;
    });

    it('should return false for a populated array', () => {
        expect(isObjectOrUndefined([ 1 ])).to.be.false;
    });

    it('should return false for a populated array with more than 1 value', () => {
        expect(isObjectOrUndefined([ 1 ])).to.be.false;
    });

    it('should return false for a number', () => {
        expect(isObjectOrUndefined(1)).to.be.false;
    });

    it('should return false for a string', () => {
        expect(isObjectOrUndefined('a')).to.be.false;
    });

    it('should return false for a boolean', () => {
        expect(isObjectOrUndefined(true)).to.be.false;
    });
});

describe('arePopulatedObjects', () => {
    it('should exist', () => {
        expect(arePopulatedObjects).to.be.a('function');
    });

    it('should return false for no value or undefined', () => {
        expect(arePopulatedObjects()).to.be.false;
    });

    it('should return false for an empty object', () => {
        expect(arePopulatedObjects({})).to.be.false;
    });

    it('should return false for a populated object', () => {
        expect(arePopulatedObjects({ a:1 })).to.be.false;
    });

    it('should return false for an empty array', () => {
        expect(arePopulatedObjects([])).to.be.false;
    });

    it('should return false for a populated array of one value (no object)', () => {
        expect(arePopulatedObjects([ 1 ])).to.be.false;
    });

    it('should return false for a populated array with more than 1 value (no objects)', () => {
        expect(arePopulatedObjects([ 1, 2, 3 ])).to.be.false;
    });

    it('should return false for a populated array of one value (object)', () => {
        expect(arePopulatedObjects([ {} ])).to.be.false;
    });

    it('should return false for a populated array with more than 1 value (objects)', () => {
        expect(arePopulatedObjects([ {}, {}, {} ])).to.be.false;
    });

    it('should return false for a populated array of one value ( populated object)', () => {
        expect(arePopulatedObjects([ { a:1 } ])).to.be.false;
    });

    it('should return true for a populated array with more than 1 value (populated objects)', () => {
        expect(arePopulatedObjects([ { a:1 }, { b:2 }, { c:3 } ])).to.be.true;
    });

    it('should return false for a number', () => {
        expect(arePopulatedObjects(1)).to.be.false;
    });

    it('should return false for a string', () => {
        expect(arePopulatedObjects('a')).to.be.false;
    });

    it('should return false for a boolean', () => {
        expect(arePopulatedObjects(true)).to.be.false;
    });
});


