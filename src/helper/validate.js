import joi from 'joi';
import { promisify } from 'util';
import asyncMiddleware from './async-middleware';

export default joiSchema => asyncMiddleware(async (req, res, next) => {
  return await promisify(joi.validate)(req.body, joiSchema)
    .then(validated => {
      req.validatedBody = validated;
      next();
    })
    .catch(error => 
      next({
        statusCode: 422, // TODO: make sure is right
        error: 'Unprocessable Entity',
        message: error.name,
        validation: error.details
      })
    );
})