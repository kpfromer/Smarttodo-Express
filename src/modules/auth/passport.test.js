import jwtStrategy, { findUser, errorCatcher } from './passport';
import User from './user.model';
import config from '../../config';
import * as passportJwt from 'passport-jwt';

jest.mock('./user.model', () => ({
  findOne: jest.fn()
}));

jest.mock('../../config', () => ({
  get: jest.fn()
}));

jest.mock('passport-jwt', () => ({
  Strategy: jest.fn(),
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn()
  }
}))

describe('passport jwt strategy', () => {
  afterEach(() => {
    jest.resetAllMocks();
  })
  describe('findUser', () => {
    let exec;
    beforeEach(() => {
      exec = jest.fn();
      User.findOne.mockReturnValue({
        exec
      });
    });
    it('resolves the user if there is a user by id', async () => {
      const mockUser = jest.fn();
      exec.mockResolvedValue(mockUser);
      const jwtPayload = {
        id: 'user-id'
      }
      const value = await findUser(jwtPayload);
      expect(User.findOne).toHaveBeenCalledWith({ _id: jwtPayload.id });
      expect(value).toBe(mockUser);
    });
    it('resolves false if there is no user by id', async () => {
      exec.mockResolvedValue(false);
      const jwtPayload = {
        id: 'user-id'
      }
      const value = await findUser(jwtPayload);
      expect(User.findOne).toHaveBeenCalledWith({ _id: jwtPayload.id });
      expect(value).toBe(false);
    });
  });
  describe('errorCatcher', () => {
    it('forwards payload to async function', done => {
      const payloadResponse = {
        id: 'userid',
        email: 'emailOfUser'
      }
      const asyncFn = async payload => {
        return payload;
      };
      errorCatcher(asyncFn)(payloadResponse, (error, value) => {
        // Value in this case should be the payload!
        expect(value).toBe(payloadResponse);
        done()
      });
    });
    it('passes async resolved value to node callback', done => {
      const resolvedValue = {
        item: 'fadsfasd'
      };
      const asyncFn = async () => {
        return resolvedValue;
      }
      errorCatcher(asyncFn)(undefined, (error, value) => {
        expect(error).toBeNull();
        expect(value).toBe(resolvedValue);
        done()
      });
    });
    it('catches async function errors and forwards them to callback', done => {
      const asyncFn = async () => {
        throw new Error('Async error!');
      }
      errorCatcher(asyncFn)(undefined, (error, value) => {
        expect(error).toMatchSnapshot();
        expect(value).toBe(false);
        done()
      });
    });
  });
  // describe('generateJwtStrategy', () => {
  //   it('uses config secret and extracts from Authorization header', () => {
  //     config.get.mockReturnValue('JWT-SECRET');
  //     passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken.mockReturnValue('MOCK-EXTRACT-JWT-FUNCTION!');
  //     expect(generateJwtStrategy()).toEqual
  //     expect(config.get).toHaveBeenCalledWith('jwt.secret');
  //   });
  // });
});