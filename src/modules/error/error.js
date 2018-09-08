import boom from 'boom';

export const notFound = (req, res, next) => 
  next(boom.notFound());

export const error = (error, req, res, next) => {
  if (!error.isBoom) { // If error is not a boom error
    error = boom.badImplementation(error);
  }

  return res.status(error.output.statusCode)
    .json(error.output.payload);
};