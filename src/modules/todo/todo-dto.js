import joi from 'joi';

export const createDto = joi.object().keys({
  description: joi.string().required(),
  completed: joi.boolean().required()
}).required();

export const patchDto = joi.object().keys({
  description: joi.string().required(),
  completed: joi.boolean().required()
}).or('description', 'completed').required();