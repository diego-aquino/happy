import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import './database/connection';

import errorHandler from './errors/handler';
import routes from './routes';

const app = express();
app.use(cors());
// allow express to understand request.body as JSON
app.use(express.json());
app.use(routes);
app.use(errorHandler);

app.listen(3333);
