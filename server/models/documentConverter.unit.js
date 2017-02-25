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
        const document = convertDocument([], { type: 'type1' });

        expect(document.errors).to.deep.include({
            errorCode: 'c2bab087-b97c-42cf-935a-cc0cdced9d1e',
            errorMsg: 'Model is invalid.'
        });
    });

    it('should expect the document to be a populated object', () => {
        const document = convertDocument(model, {});

        expect(document.errors).to.deep.include({
            errorCode: '3fea2875-e462-4842-a3f6-09cb1677a493',
            errorMsg: 'Provided document has no fields.'
        });
    });

    it('should expect the document to have all the required fields', () => {
        const document = convertDocument(model, { a:1, type: 'type1' });

        expect(document.errors).to.deep.include({
            errorCode: '2097cce8-f4c3-4173-9553-1b9a55248f3f',
            errorMsg: 'Field is not defined on the document and is required.',
            errorField: 'id'
        });
    });

    it('should match the field types in the model to the fields in the document', () => {
        expect(convertDocument(model, {id: '1', type: 'type1' }).errors).to.deep.include({
            errorCode: '56fc8804-3c94-434d-8e51-367680177f04',
            errorMsg: 'Field does not have valid input.',
            errorField: 'id',
            expectedType: 'number',
            providedType: 'string'
        });

        expect(convertDocument(model, {id: 1, type: 1}).errors).to.deep.include({
            errorCode: '56fc8804-3c94-434d-8e51-367680177f04',
            errorMsg: 'Field does not have valid input.',
            errorField: 'type',
            expectedType: 'string',
            providedType: 'number'
        });

        expect(convertDocument(model, {id: 1, type: 'type1', name: 42}).errors).to.deep.include({
            errorCode: '56fc8804-3c94-434d-8e51-367680177f04',
            errorMsg: 'Field does not have valid input.',
            errorField: 'name',
            expectedType: 'string',
            providedType: 'number'
        });

        expect(convertDocument(model, {id: 1, type: 'type1', name: undefined}).errors).to.have.length(0);
        expect(convertDocument(model, {id: 1, type: 'type1', name: 'Patrick'}).errors).to.have.length(0);
    });

    it('should provide an error for fields that are empty', () => {
        console.log(convertDocument(model, {id: 1, type: ''}));
        expect(convertDocument(model, {id: 1, type: ''}).errors).to.deep.include({
            errorCode: 'e12af28f-42c7-4bf1-a2f1-18306735f952',
            errorMsg: 'Field may not contain an empty string or array.',
            errorField: 'type'
        });
    });

    it('should return an object when both model and document are correct provided', () => {
        const result = convertDocument(model, {id: 1, type: 'type1'});
        expect(result.errors).to.have.length(0);
    });

    it('should remove fields that are not in the model', () => {
        const results = convertDocument(mode, {id: 1, type: 'type1', extra: 'hello'});

        expect(results).to.have.property(document);
        // TODO: Finish me
        // expect(results)

        /*
        const document = convertDocument(model, { id: 1, type: 'type1', name: 'Patrick', extra: 'hello' });
        expect(document).to.have.property('id', 1);
        expect(document).to.have.property('type', 'type1');
        expect(document).to.have.property('name', 'Patrick');
        expect(document).not.to.have.property('extra');
        */
    });
});
