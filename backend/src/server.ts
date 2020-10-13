import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
// allow express to understand request.body as JSON
app.use(express.json());

app.listen(3333);
