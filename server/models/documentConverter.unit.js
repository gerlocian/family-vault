'use strict';

import curry from 'lodash/curry';
import {expect} from 'chai';
import convertDocument from './documentConverter';
import model from './test.model.json';

const hasErrorCode = curry((code, error) => error.errorCode && error.errorCode === code);
const hasErrorMsg = curry((msg, error) => error.errorMsg && error.errorMsg === msg);

const hasErrorWithCode = curry((code, document) => document.errors.some(hasErrorCode(code)));
const hasErrorWithMsg = curry((msg, document) => document.errors.some(hasErrorMsg(msg)));

describe('convertDocument', () => {
    it('should exist', () => {
        expect(convertDocument).to.be.a('function');
    });

    it('should return a function when only given the model', () => {
        expect(convertDocument(model)).to.be.a('function');
    });

    it('should expect the model to be a populated array', () => {
        const document = convertDocument([], { type: 'type1' });
        expect(document).to.be.a('object');
        expect(document).to.have.property('errors');
        expect(document.errors).to.have.length.above(0);

        expect(document).to.satisfy(hasErrorWithCode('c2bab087-b97c-42cf-935a-cc0cdced9d1e'), 'Error code is incorrect');
        expect(document).to.satisfy(hasErrorWithMsg('Model is invalid.'), 'Error message is incorrect');
    });

    xit('should expect the document to be a populated object', () => {
        expect(() => convertDocument(model, {})).to.throw();
    });

    xit('should expect the document to have all the required fields', () => {
        expect(() => convertDocument(model, { a:1, type: 'type1' })).to.throw();
    });

    xit('should match the field types in the model to the fields in the document', () => {
        expect(() => convertDocument(model, { id: '1', type: 'type1' })).to.throw();
        expect(() => convertDocument(model, { id: 1, type: 1 })).to.throw();
        expect(() => convertDocument(model, { id: 1, type: 'type1', name: '' })).to.throw();
        expect(() => convertDocument(model, { id: 1, type: 'type1', name: undefined })).not.to.throw();
        expect(() => convertDocument(model, { id: 1, type: 'type1', name: 42 })).to.throw();
    });

    xit('should return an object when both model and document are correct provided', () => {
        expect(convertDocument(model, { id: 1, type: 'type1' })).to.be.a('object');
    });

    xit('should remove fields that are not in the model', () => {
        const document = convertDocument(model, { id: 1, type: 'type1', name: 'Patrick', extra: 'hello' });
        expect(document).to.have.property('id', 1);
        expect(document).to.have.property('type', 'type1');
        expect(document).to.have.property('name', 'Patrick');
        expect(document).not.to.have.property('extra');
    });
});
