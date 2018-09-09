import joi from 'joi';

export const registerDto = joi.object().keys({
  username: joi.string().required().min(4).max(30),
  password: joi.string().required().min(3).max(60),
  email: joi.string().required().email(),
  firstName: joi.string().required().trim().min(2).max(30).regex(/^[a-z]+$/i, { name: 'alphabet' }),
  lastName: joi.string().required().trim().min(2).max(30).regex(/^[a-z]+$/i, { name: 'alphabet' })
}).required();