import { CreateChain } from './create-chain';
describe('CreateChain', () => {
  let api, initial;
  beforeEach(() => {
    initial = number => number * 2;
    api = new CreateChain(initial);
  });
  it('runs initial function', () => {
    expect(api.run(5)).toBe(initial(5));
  });
  describe('add middleware', () => {
    let a, b, c;
    beforeEach(() => {
      a = number => number - 10;
      b = number => number * 100;
      c = number => number / .5;
      api
        .addMiddleware(a)
        .addMiddleware(b)
        .addMiddleware(c)
    });
    it('runs last middleware to initial (LIFO)', () => {
      expect(api.run(10)).toBe(initial(a(b(c(10)))))
    });
  });
});