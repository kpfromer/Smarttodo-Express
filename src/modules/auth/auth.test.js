import User from './user.model';
import { registerUser, loginUser } from './auth';
import jwt from 'jsonwebtoken';
import config from '../../config';

// Setup mock model
jest.mock('./user.model', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

// Mock jwt sign
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

// Mock config (jwt)
jest.mock('../../config', () => ({
  get: jest.fn()
}))

describe('auth', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('registerUser', () => {
    let exec;
    beforeEach(() => {
      exec = jest.fn();
      User.findOne.mockReturnValue({
        exec
      });
    });
    
    it('creates a user', async () => {
      exec.mockResolvedValue(null);
      // jest.spyOn(User.findOne, 'exec').mockResolvedValue(null);
      const userDetails = {
        username: 'hello',
        password: 'whatupworld',
        firstName: 'jack',
        lastName: 'Myers',
        email: 'jmyers@example.com'
      };

      const returnValue = await registerUser(userDetails)

      // expect(res.status).toBe(200);
      expect(User.findOne).toHaveBeenCalledWith({ $or: [{ username: userDetails.username }, { email: userDetails.email }] })
      expect(exec).toHaveBeenCalled();
      expect(User.create).toBeCalledWith(userDetails);
      expect(returnValue).toMatchSnapshot();
    });
    it('throws an error when username is already taken', async () => {
      exec.mockResolvedValue({
        username: 'hello',
        password: 'adsfasd',
        firstName: 'mick',
        lastName: 'jackson',
        email: 'mjaskson@example.com'
      });
      let thrownError;
      // jest.spyOn(User.findOne, 'exec').mockResolvedValue(null);
      const userDetails = {
        username: 'hello',
        password: 'whatupworld',
        firstName: 'jack',
        lastName: 'Myers',
        email: 'jmyers@example.com'
      };

      try {
        await registerUser(userDetails)
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).toMatchSnapshot();
      expect(User.create).not.toBeCalled();
    });
    it('throws an error when email is already taken', async () => {
      exec.mockResolvedValue({
        username: 'adfasdfasdfhadsf',
        password: 'adsfasd',
        firstName: 'mick',
        lastName: 'jackson',
        email: 'jmyers@example.com'
      });
      let thrownError;
      // jest.spyOn(User.findOne, 'exec').mockResolvedValue(null);
      const userDetails = {
        username: 'hello',
        password: 'whatupworld',
        firstName: 'jack',
        lastName: 'Myers',
        email: 'jmyers@example.com'
      };

      try {
        await registerUser(userDetails)
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).toMatchSnapshot();
      expect(User.create).not.toBeCalled();
    });
  }); 
  describe('loginUser', () => {
    let exec, checkPassword;
    beforeEach(() => {
      exec = jest.fn();
      checkPassword = jest.fn()
      User.findOne.mockReturnValue({
        exec
      });
      exec.mockResolvedValue({
        _id: 'the-id-of-the-user',
        checkPassword
      });
    });
    it('logins in the user', async () => {
      config.get.mockImplementation(value => {
        if (value === 'jwt.secret')
          return 'JWT-SECRET-TESTING'
        else if (value === 'jwt.expireIn')
          return 'JWT-EXPIRE-IN';
        else
          throw new Error('Unknown config get value! (TESTING)')
      });
      jwt.sign.mockReturnValue('ENCRYPTED-JWT-TOKEN');
      checkPassword.mockReturnValue(true);
      
      const returnValue = await loginUser({ username: 'jackson', password: 'whatupworld!'})
      expect(User.findOne).toHaveBeenCalledWith({ username: 'jackson' });
      expect(checkPassword).toHaveBeenCalledWith('whatupworld!');
      expect(jwt.sign.mock.calls[0]).toMatchSnapshot();
      expect(returnValue).toMatchSnapshot();
    });
    it('errors if passwords don\'t match', async () => {
      let thrownError;
      checkPassword.mockReturnValue(false);
      
      try {
        await loginUser({ username: 'jackson', password: 'whatupworld!'})
      } catch(error) {
        thrownError = error;
      }
      expect(checkPassword).toHaveBeenCalledWith('whatupworld!');
      expect(thrownError).toMatchSnapshot();
    });
    it('errors if the user doesn\'t exist', async () => {
      let thrownError;
      exec.mockReturnValue(null);
      
      try {
        await loginUser({ username: 'jackson', password: 'whatupworld!'})
      } catch(error) {
        thrownError = error;
      }
      expect(thrownError).toMatchSnapshot();
    });
  });
})