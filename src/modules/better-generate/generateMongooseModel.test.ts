import * as generate from './generateMongooseModel';
import { mongooseModelObject, mongooseModelSingleProp } from "./generateMongooseModel";
import { SingleProp, Structure } from "./types";
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  model: jest.fn(),
  Schema: jest.fn()
}))

describe('mongooseModelSingleProp', () => {
  describe('mongoose type', () => {
    it('recursively runs mongooseModelObject if type is an object', () => {
      const schema = {
        type: {
          subItemTitle: { type: 'string' },
          subItemAge: { type: 'number' }
        }
      } as SingleProp;
      expect(mongooseModelSingleProp(schema)).toMatchSnapshot();
    });
    it('sets type to array if isArray', () => {
      const result = mongooseModelSingleProp({ type: 'string', isArray: true});
      expect(result).toMatchSnapshot();
      expect(result.type.length).toBe(1);
      expect(result.type[0]).toBe(String);
    });

    it('maps Number to "number"', () => {
      expect(mongooseModelSingleProp({ type: 'string' })).toMatchObject({
        type: String
      });
    });
    it('maps String to "string"', () => {
      expect(mongooseModelSingleProp({ type: 'number' })).toMatchObject({
        type: Number
      });
    });
  });

  describe('mongoose required', () => {
    it('defaults to false', () => {
      expect(mongooseModelSingleProp({ type: 'string' })).toMatchObject({ required: false });
    });
    it('sets required to user input', () => {
      expect(mongooseModelSingleProp({ type: 'string', required: true })).toMatchObject({ required: true });
    });
  });
});

describe('mongooseModelObject', () => {
  it('converts each key into a proper mongoose option', () => {
    expect(mongooseModelObject({
      name: { type: 'string', required: true },
      project: { type: 'string', required: true }
    })).toMatchSnapshot();
  })
});

describe('createMongooseModel', () => {
  let createMongooseModel, mockModel, mockSchema, mockMongooseModelObject;
  beforeEach(() => {
    mockModel = jest.fn();
    mockSchema = jest.fn();

    jest.doMock('mongoose', () => ({
      model: mockModel,
      Schema: mockSchema
    }));

    // mockMongooseModelObject = jest.fn();
    mockMongooseModelObject = jest.spyOn(generate, 'mongooseModelObject')
    // jest.doMock('./generateMongooseModel', () => ({
    //   ...require.requireActual('./generateMongooseModel'),
    //   mongooseModelObject: mockMongooseModelObject
    // }))

    createMongooseModel = require('./generateMongooseModel').createMongooseModel;
    // console.log({ createMongooseModel });
  });

  it('creates a model using the dynamically generated schema', () => {
    const userStructure = {
      databaseName: 'testitem',
      schema: {
        name: { type: 'string', required: true },
        project: { type: 'string', required: true }
      },
      authenticated: false
    } as Structure;


    (mongoose.model as any).mockImplementation((dbName, schema) => `Model called "${dbName}" of "${schema}"`); // TODO: FIX
    (mongoose.Schema as any).mockImplementation(value => `Schema of ${value}`);
    mockMongooseModelObject.mockReturnValue('generated typings');

    const result = createMongooseModel(userStructure);
    
    expect(result).toMatchSnapshot();
    expect(mockMongooseModelObject).toHaveBeenCalledWith(userStructure.schema)
  })
});