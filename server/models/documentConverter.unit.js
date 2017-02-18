'use strict';

import {expect} from 'chai';
import convertDocument from './documentConverter';
import model from './test.model.json';

describe('convertDocument', () => {
    it('should exist', () => {
        expect(convertDocument).to.be.a('function');
    });

    it('should return a function when only given the model', () => {
        expect(convertDocument(model)).to.be.a('function');
    });

    it('should expect the model to be a populated array', () => {
        expect(() => convertDocument([], { type: 'type1' })).to.throw();
    });

    it('should expect the document to be a populated object', () => {
        expect(() => convertDocument(model, {})).to.throw();
    });

    it('should expect the document to have all the required fields', () => {
        expect(() => convertDocument(model, { a:1, type: 'type1' })).to.throw();
    });

    it('should match the field types in the model to the fields in the document', () => {
        expect(() => convertDocument(model, { id: '1', type: 'type1' })).to.throw();
        expect(() => convertDocument(model, { id: 1, type: 1 })).to.throw();
        expect(() => convertDocument(model, { id: 1, type: 'type1', name: '' })).to.throw();
        expect(() => convertDocument(model, { id: 1, type: 'type1', name: undefined })).not.to.throw();
        expect(() => convertDocument(model, { id: 1, type: 'type1', name: 42 })).to.throw();
    });

    it('should return an object when both model and document are correct provided', () => {
        expect(convertDocument(model, { id: 1, type: 'type1' })).to.be.a('object');
    });

    it('should remove fields that are not in the model', () => {
        const document = convertDocument(model, { id: 1, type: 'type1', name: 'Patrick', extra: 'hello' });
        expect(document).to.have.property('id', 1);
        expect(document).to.have.property('type', 'type1');
        expect(document).to.have.property('name', 'Patrick');
        expect(document).not.to.have.property('extra');
    });
});
