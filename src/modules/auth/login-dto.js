import joi from 'joi';

export const loginDto = joi.object().keys({
  username: joi.string().required(),
  password: joi.string().required()
}).required();