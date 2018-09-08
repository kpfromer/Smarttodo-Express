import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { error, notFound } from './modules/error/error';

mongoose.connect('mongodb://localhost:27017/smarttodo-express', { useMongoClient: true });

const app = express();
// Express Config
app.use(bodyParser.json());

// Error handling
app.use(notFound);
app.use(error);

app.listen(3000, () => console.log('listening on port 3000'));