import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';

import {CommonRoutesConfig} from './common/common.routes.config';
import {UsersRoutes} from './users/users.routes.config';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: any = [];
const debug = require('debug')('app');

app.use(bodyparser.json({limit: '5mb'}));

let index = expressWinston.requestWhitelist.indexOf('headers');
if (index !== -1) expressWinston.requestWhitelist.splice(index, 1);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    } else {
        return next();
    }
});

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

routes.push(new UsersRoutes(app));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));


app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at port ${port}`)
});
server.listen(port, () => {
    debug(`Server running at port ${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debug(`Routes configured for ${route.getName()}`);
    });
});