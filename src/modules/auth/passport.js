import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from './user.model';
import config from '../../config';

export const findUser = async jwtPayload => {
  const user = await User.findOne({ _id: jwtPayload.id }).exec();
  if (!!user) {
    return user;
  }
  return false;
}

export const errorCatcher = asyncFn => (jwtPayload, done) =>
  asyncFn(jwtPayload)
    .then(authenticated => done(null, authenticated))
    .catch(error => done(error, false));

const generateJwtStrategy = () => {
  const options = {
    secretOrKey: config.get('jwt.secret'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };
  return new JwtStrategy(options, errorCatcher(findUser));
}

export default generateJwtStrategy;