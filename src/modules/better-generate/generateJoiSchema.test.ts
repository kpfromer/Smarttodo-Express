import { createDto } from "./generateJoiSchema";
import joi from 'joi';
import { StructureSchema } from "./types";

describe('createDto', () => {
  it('creates a required root object', () => {
    const schema = {} as StructureSchema;
    const joiSchema = joi.object({}).required();

    expect(createDto(schema)).toEqual(joiSchema);
  })
  it('isArray creates validates for array', () => {
    const schema = {
      items: { isArray: true, type: 'string' }
    } as StructureSchema;
    const joiSchema = joi.object({
      items: joi.array().items(joi.string())
    }).required();

    expect(createDto(schema)).toEqual(joiSchema);
  })
  it('recursively creates a joi schema', () => {
    const schema = {
      project: {
        type: {
          name: { type: 'string' }
        }
      }
    } as StructureSchema;
    const joiSchema = joi.object({
      project: joi.object({
        name: joi.string()
      })
    }).required()

    expect(createDto(schema)).toEqual(joiSchema);
  });
  it('adds required field if required', () => {
    const schema = {
      name: { type: 'string', required: true}
    } as StructureSchema;
    const joiSchema = joi.object({
      name: joi.string().required()
    }).required()

    expect(createDto(schema)).toEqual(joiSchema);
  });
  describe('types', () => {
    it('creates a string', () => {
      const schema = {
        name: { type: 'string' }
      } as StructureSchema;
      const joiSchema = joi.object({
        name: joi.string()
      }).required()
  
      expect(createDto(schema)).toEqual(joiSchema);
    });
    it('creates a number', () => {
      const schema = {
        name: { type: 'number' }
      } as StructureSchema;
      const joiSchema = joi.object({
        name: joi.number()
      }).required()
  
      expect(createDto(schema)).toEqual(joiSchema);
    });
    // it('creates an email');
  });

  describe('when optionalValues is true', () => {
    it('makes every option optional', () => {
      const schema = {
        name: { type: 'string', required: false },
        age: { type: 'number', required: true }
      } as StructureSchema;
      const joiSchema = joi.object({
        name: joi.string(),
        age: joi.number()
      }).or(['name', 'age']);
  
      expect(createDto(schema, true)).toEqual(joiSchema);
    });
  });
})