import express from 'express';
import path from 'path';
import cors from 'cors';
import * as dotenv from 'dotenv';


import { corsOptions } from './config/corsOptions.js';
import { logger } from './middleware/logEvents.js';
import {errorHandler} from './middleware/errorHandler.js';
import { rootRouter } from './routes/root.js';
import { employeesRouter } from './routes/api/employees.js';
import { topicsRouter } from './routes/api/topics.js';

const app = express();

// custom middleware logger
app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use('/', express.static(path.join(path.resolve(), '/public')));

// routes
app.use('/', rootRouter);
app.use('/explore', topicsRouter);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.send({ "error": "404 Not Found" });
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

const PORT = 3700;
app.listen(PORT, () => {
    // console.log(process.env)
    console.log(`Server running on port ${PORT}`)
});