import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { error, notFound } from './modules/error/error';
import config from './config';

mongoose.connect(config.get('db.url'), { useMongoClient: true });

const app = express();
// Express Config
app.use(bodyParser.json());

// Error handling
app.use(notFound);
app.use(error);

app.listen(config.get('port'), () => console.log(`listening on port ${config.get('port')}`));