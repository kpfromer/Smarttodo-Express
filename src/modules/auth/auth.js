import boom from 'boom';
import User from './user.model';
import jwt from 'jsonwebtoken';
import config from '../../config';

export const registerUser = async userDetails => {
  const { username, password, email, firstName, lastName } = userDetails;
  const user = await User.findOne({ $or: [{username}, {email}] }).exec();

  if (!!user) {
    let message = 'Username already taken';
    if (user.username === username && user.email === email) {
      message = 'Username/email already taken';
    } else if (user.email === email) {
      message = 'Email already taken';
    }
    
    throw boom.badRequest(message);
  }

  await User.create({
    username,
    password,
    email,
    firstName,
    lastName
  })

  return {
    success: true,
    message: 'Successfully registered'
  };
}

export const loginUser = async userDetails => {
  const { username, password } = userDetails;

  const user = await User.findOne({ username }).exec();
  if (
    !!user &&
    user.checkPassword(password)
  ) {
    return {
      access_token: jwt.sign({ id: user._id }, config.get('jwt.secret'), { expiresIn: config.get('jwt.expireIn') })
    };
  }
  throw boom.badRequest('Username/password do not match');
}