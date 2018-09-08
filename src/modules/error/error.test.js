import errorMiddleware from './error';
import boom from 'boom';
import express from 'express';
import request from 'supertest';

describe('error', () => {
  let initApp;
  let app;
  beforeEach(() => {
    initApp = error => {
      app = express();
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