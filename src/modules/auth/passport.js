import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from './user.model';
import config from '../../config';
import jwtStrategy from './passport';

export const findUser = (jwtPayload, done) => {
  User.findOne({
    _id: jwtPayload.id
  }, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      // sets req.user = user
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}

const generateJwtStrategy = () => {
  const options = {
    secretOrKey: config.get('jwt.secret'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };
  return new JwtStrategy(options, findUser);
}

export default generateJwtStrategy;