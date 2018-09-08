import { notFound as notFoundMiddleware, error as errorMiddleware } from './error';
import boom from 'boom';
import express from 'express';
import request from 'supertest';

describe('error', () => {
  describe('not found', () => {
    let next;
    beforeEach(() => {
      next = jest.fn()
    });
    it('nexts boom notFound', async () => {
      await notFoundMiddleware(undefined, undefined, next);
      const error = next.mock.calls[0][0];
      expect(error.isBoom).toBe(true);
      expect(error).toMatchSnapshot();
    });
  });
  describe('error handling', () => {
    let initApp;
    beforeEach(() => {
      initApp = error => {
        const app = express();
        app.get('/error', (req, res, next) =>
          next(error)
        );
        app.use(errorMiddleware);
        return app;
      }
    });
    it('displays custom errors as json', async () => {
      const res = await request(initApp(boom.badRequest('Bad user input'))).get('/error');
      expect(res.status).toBe(400);
      expect(res.body).toMatchSnapshot();
    });
  });
});