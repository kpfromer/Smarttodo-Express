import joi from 'joi';
import validate from './validate';

describe('validate', () => {
  let next;
  beforeEach(() => {
    next = jest.fn();
  });
  it('handles error if data doesn\'t match joi schema', async () => {
    const schema = joi.object().keys({
      name: joi.string().required(),
      age: joi.number().positive()
    }).required();

    const req = {
      body: {
        name: '',
        age: -12451235213
      }
    }

    await validate(schema)(req, undefined, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0]).toMatchSnapshot();
  });
});