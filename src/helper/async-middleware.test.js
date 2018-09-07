import asyncMiddleware from './async-middleware';

describe('async middleware', () => {
  let req, res, next;
  beforeEach(() => {
    req = jest.fn();
    res = jest.fn();
    next = jest.fn();
  });
  it('forwards req, res and next to function', async () => {
    const mockMiddleware = jest.fn();
    await asyncMiddleware(mockMiddleware)(req, res, next);
    expect(mockMiddleware).toHaveBeenCalledWith(req, res, next);
  });
  it('catches errors forwards them to the next functions', async () => {
    const errorFunction = async () => {
      throw new Error('ERROR');
    };
    await asyncMiddleware(errorFunction)(req, res, next);
    expect(next).toHaveBeenCalledWith(Error('ERROR'));
  });
  it('returns a promise', async () => {
    next.mockImplementation(value => value);
    const mockMiddleware = (req, res, next) => next('hello world!');
    const returnValue = await asyncMiddleware(mockMiddleware)(req, res, next);
    expect(returnValue).toBe('hello world!');
  })
});