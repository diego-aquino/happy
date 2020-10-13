import express from 'express';
import cors from 'cors';

import routes from './routes';

const app = express();
app.use(cors());
// allow express to understand request.body as JSON
app.use(express.json());
app.use(routes);

app.listen(3333);
