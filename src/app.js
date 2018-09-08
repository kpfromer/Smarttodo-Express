import express from 'express';
import bodyParser from 'body-parser';
import { error, notFound } from './modules/error/error';

const app = express();
// Express Config
app.use(bodyParser.json());

// Error handling
app.use(notFound);
app.use(error);

app.listen(3000, () => console.log('listening on port 3000'));