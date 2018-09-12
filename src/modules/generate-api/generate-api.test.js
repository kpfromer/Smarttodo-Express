import express from 'express';
import request from 'supertest';
import joi from 'joi';
import passport from 'passport';
import bodyParser from 'body-parser';

jest.mock('passport', () => ({
  authenticate: jest.fn()
}));

describe('generate api', () => {
  let initApp;
  let mockAuthenticated, model;
  let authFindAll, authGetById, authCreate, authPut, authPatch, authRemove;
  beforeEach(() => {
    const nothingMiddleware = (req, res) => res.json({ nothing: true });
    authFindAll = jest.fn().mockReturnValue(nothingMiddleware);
    authGetById = jest.fn().mockReturnValue(nothingMiddleware);
    authCreate = jest.fn().mockReturnValue(nothingMiddleware);
    authPut = jest.fn().mockReturnValue(nothingMiddleware);
    authPatch = jest.fn().mockReturnValue(nothingMiddleware);
    authRemove = jest.fn().mockReturnValue(nothingMiddleware);

    // TODO: test that this is called
    passport.authenticate.mockReturnValue((req, res, next) => next());

    mockAuthenticated = jest.fn().mockReturnValue({
      findAll: authFindAll,
      getById: authGetById,
      create: authCreate,
      put: authPut,
      patch: authPatch,
      remove: authRemove
    });

    const createUpdateDto = joi.object().keys({
      name: joi.string().required(),
      age: joi.number().required()
    }).required();

    const patchDto = joi.object().keys({
      name: joi.string(),
      age: joi.number()
    }).or('name', 'age').required();

    model = jest.fn();

    initApp = (expectError = false) => {
      const app = express();
      const generateApi = require('./generate-api').default;
      app.use(bodyParser.json());
      app.use(generateApi({
        createUpdateDto,
        patchDto,
        model,
        authenticated: mockAuthenticated
      }));
      app.use((error, req, res, next) => {
        if (!expectError)
          console.error(error);
        res.status(500).json({ error });
      })
      return app;
    }
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  // TODO: expect authenticated to bell called with
  describe('GET /', () => {
    beforeEach(() => {
      authFindAll.mockReturnValue((req, res) => {
        res.json([{
            id: '1',
            name: 'kyle'
          },
          {
            id: '2',
            name: 'edward'
          }
        ]);
      });
    });
    it('returns all items', async () => {
      const res = await request(initApp()).get('/');

      expect(res.body).toMatchSnapshot();
      expect(res.status).toBe(200);
    });
    it('fails if not authenticated', async () => {
      passport.authenticate.mockReturnValue((req, res) => res.status(403).send('Unauthorized'));
      const res = await request(initApp()).get('/');

      expect(res.status).toBe(403);
      expect(res.text).toBe('Unauthorized');
    });
  });
  describe('GET /:id', () => {
    beforeEach(() => {
      authGetById.mockReturnValue((req, res) => {
        return res.json({
          id: '5b93f9524458c6452947afdd',
          name: 'jack bike'
        });
      });
    });
    it('gets the item by id', async () => {
      const id = '5b93f9524458c6452947afdd';
      const res = await request(initApp()).get(`/${id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
    it('errors if id is not a valid mongo id', async () => {
      const id = 'adfasdfasdfas';
      const res = await request(initApp(true)).get(`/${id}`);
      expect(res.status).toBe(500);
      expect(res.body).toMatchSnapshot();
    });
    it('fails if not authenticated', async () => {
      passport.authenticate.mockReturnValue((req, res) => res.status(403).send('Unauthorized'));
      const res = await request(initApp()).get('/');

      expect(res.status).toBe(403);
      expect(res.text).toBe('Unauthorized');
    });
  });
  describe('POST /', () => {
    beforeEach(() => {
      authCreate.mockReturnValue((req, res) => {
        return res.json({
          id: '235dsadf4',
          name: 'jack mike',
          age: 123
        });
      });
    });
    it('gets the item with the validated body', async () => {
      const res = await request(initApp())
        .post('/')
        .set('Content-Type', 'application/json')
        .send({ name: 'afdasdfa', age: 423 })
        expect(res.body).toMatchSnapshot();
        expect(res.status).toBe(200);
    });
    it('errors if the body is not valid', async () => {
      const res = await request(initApp(true))
        .post('/')
        .set('Content-Type', 'application/json')
        .send({ a: 'asdfas' });
      expect(res.status).toBe(500);
      expect(res.body).toMatchSnapshot();
    });
    it('fails if not authenticated', async () => {
      passport.authenticate.mockReturnValue((req, res) => res.status(403).send('Unauthorized'));
      const res = await request(initApp()).get('/');

      expect(res.status).toBe(403);
      expect(res.text).toBe('Unauthorized');
    });
  });
  describe('PUT /:id', () => {
    beforeEach(() => {
      authPut.mockReturnValue((req, res) => {
        res.json({
          id: '123',
          name: 'new name',
          age: 18
        });
      });
    });
    it('updates a task by id', async () => {
      const id = '5b93f9524458c6452947afdd';
      const res = await request(initApp())
        .put(`/${id}`)
        .send({ name: 'new name', age: 18 });
      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
    it('errors if id is invalid mongo id', async () => {
      const id = 'afda';
      const res = await request(initApp(true))
        .put(`/${id}`)
        .send({ name: 'new name', age: 18 });
      expect(res.status).toBe(500);
      expect(res.body).toMatchSnapshot();
    });
    it('errors if body is not valid createDto', async () => {
      const id = '5b93f9524458c6452947afdd';
      const res = await request(initApp(true))
        .put(`/${id}`)
        .send({ name: '' });
      expect(res.status).toBe(500);
      expect(res.body).toMatchSnapshot();
    });
    it('fails if not authenticated', async () => {
      passport.authenticate.mockReturnValue((req, res) => res.status(403).send('Unauthorized'));
      const res = await request(initApp()).get('/');

      expect(res.status).toBe(403);
      expect(res.text).toBe('Unauthorized');
    });
  });
  describe('PATCH /:id', () => {
    beforeEach(() => {
      authPatch.mockReturnValue((req, res) => {
        res.json({
          id: '123',
          name: 'same-name-different-age',
          age: 18
        });
      });
    });
    it('updates a task by id', async () => {
      const id = '5b93f9524458c6452947afdd';
      const res = await request(initApp())
        .patch(`/${id}`)
        .send({
          age: 18
        });
      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
    it('errors if id is invalid mongo id', async () => {
      const id = 'afda';
      const res = await request(initApp(true))
        .patch(`/${id}`)
        .send({
          age: 18
        });
      expect(res.status).toBe(500);
      expect(res.body).toMatchSnapshot();
    });
    it('errors if body is not valid patchDto', async () => {
      const id = '5b93f9524458c6452947afdd';
      const res = await request(initApp(true))
        .patch(`/${id}`)
        .send({});
      expect(res.status).toBe(500);
      expect(res.body).toMatchSnapshot();
    });
    it('fails if not authenticated', async () => {
      passport.authenticate.mockReturnValue((req, res) => res.status(403).send('Unauthorized'));
      const res = await request(initApp()).get('/');

      expect(res.status).toBe(403);
      expect(res.text).toBe('Unauthorized');
    });
  });
  describe('DELETE /:id', () => {
    beforeEach(() => {
      authRemove.mockReturnValue((req, res) => {
        res.json({
          nOk: 1,
          nRemoved: 1
        });
      });
    });
    it('removes the item by id', async () => {
      const id = '5b93f9524458c6452947afdd';
      const res = await request(initApp()).delete(`/${id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchSnapshot();
    });
    it('errors if id is not valid mongo id', async () => {
      const id = 'adsf';
      const res = await request(initApp(true)).delete(`/${id}`);

      expect(res.status).toBe(500);
      expect(res.body).toMatchSnapshot();
    });
    it('fails if not authenticated', async () => {
      passport.authenticate.mockReturnValue((req, res) => res.status(403).send('Unauthorized'));
      const res = await request(initApp()).get('/');

      expect(res.status).toBe(403);
      expect(res.text).toBe('Unauthorized');
    });
  });
});