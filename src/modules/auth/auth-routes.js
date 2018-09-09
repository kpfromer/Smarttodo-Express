import express from 'express';
import { registerUser, loginUser } from './auth';
import validate from '../../helper/validate';
import asyncMiddleware from '../../helper/async-middleware';
import { loginDto } from './login-dto';
import { registerDto } from './register-dto';

const router = express.Router();

router.post('/register', validate(registerDto), asyncMiddleware(async (req, res) =>
  res.json(await registerUser(req.validatedBody))
));

router.post('/login', validate(loginDto), asyncMiddleware(async (req, res) =>
  res.json(await loginUser(req.validatedBody))
));

export default router;