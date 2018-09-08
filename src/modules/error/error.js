import boom from 'boom';

export const notFound = (req, res, next) => 
  next(boom.notFound());

export const error = (error, req, res, next) => {
  return res.status(error.output.statusCode)
    .json(error.output.payload);
};