import express from 'express';
import todo from './modules/todo/todo';
import authRoutes from './modules/auth/auth-routes';

const router = express.Router();

router.use('/', authRoutes);
router.use('/todo', todo);

export default router;