import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import jwtStrategy from './modules/auth/passport';
import authRoutes from './modules/auth/auth-routes';
import { error, notFound } from './modules/error/error';
import config from './config';

mongoose.connect(config.get('db.url'), { useMongoClient: true });
passport.use(jwtStrategy);

const app = express();
// Express Config
app.use(bodyParser.json());
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);

// Error handling
app.use(notFound);
app.use(error);

app.listen(config.get('port'), () => console.log(`listening on port ${config.get('port')}`));