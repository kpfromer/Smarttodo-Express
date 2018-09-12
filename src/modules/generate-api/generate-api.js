import express from 'express';
import passport from 'passport';
import validate from '../../helper/validate';
import validateId from './validate-id';
// import authenticated from './authenticated';

function generateApi({
  createUpdateDto,
  patchDto,
  model,
  authenticated
}) {
  const router = express.Router();
  
  const { findAll, getById, create, put, patch, remove } = authenticated(model, req => req.validatedBody, req => req.user.id);
  // findAll()(1, {
  //   json: value => console.log(value)
  // });
  const authenticate = passport.authenticate('jwt', { session: false });
  const getIdFromParams = req => req.params.id;
  const validateIdFromParams = validateId(getIdFromParams);

  router.get('/', authenticate, findAll());
  router.get('/:id', authenticate, validateIdFromParams, getById(getIdFromParams));

  router.post('/', authenticate, validate(createUpdateDto), create());
  
  router.put('/:id', authenticate, validateIdFromParams, validate(createUpdateDto), put(getIdFromParams)); // total modification
  router.patch('/:id', authenticate, validateIdFromParams, validate(patchDto), patch(getIdFromParams)); // partial modification
  
  router.delete('/:id', authenticate, validateIdFromParams, remove(getIdFromParams));

  return router;
}

export default generateApi;