import joi from 'joi';
import validate from './validate';

describe('validate', () => {
  let next, schema;
  beforeEach(() => {
    next = jest.fn();
    schema = joi.object().keys({
      name: joi.string().required(),
      age: joi.number().positive()
    }).required();
  });
  it('handles error if data doesn\'t match joi schema', async () => {
    const req = {
      body: {
        name: '',
        age: -12451235213
      }
    }
    await validate(schema)(req, undefined, next);
    expect(next.mock.calls[0]).toMatchSnapshot();
  });
  it('attaches validated schema to req and continues express middleware chain', async () => {
    const req = {
      body: {
        name: 'Jack Ryan',
        age: 23
      }
    }
    await validate(schema)(req, undefined, next);
    expect(next).toHaveBeenCalledWith(); // called with nothing (like errors!)
    expect(req.validatedBody).toEqual({
      name: 'Jack Ryan',
      age: 23
    });
  });
});