import joi from 'joi';
import boom from 'boom';
import { promisify } from 'util';
import asyncMiddleware from './async-middleware';

export default joiSchema => asyncMiddleware(async (req, res, next) => {
  return await promisify(joi.validate)(req.body, joiSchema)
    .then(validated => {
      req.validatedBody = validated;
      next();
    })
    .catch(error => 
      next(boom.badData(undefined, { validation: error.details }))
    );
})