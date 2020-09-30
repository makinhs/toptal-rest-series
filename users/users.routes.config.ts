import {CommonRoutesConfig, configureRoutes} from '../common/common.routes.config';
import express from 'express';

export class UsersRoutes extends CommonRoutesConfig implements configureRoutes {
    constructor(app: express.Application) {
        super(app, 'UsersRoute');
        this.configureRoutes();
    }

    configureRoutes() {

        this.app.route(`/users`)
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`List of users`);
            })
            .post((req: express.Request, res: express.Response) => {
                res.status(200).send(`Post to users`);
            });

        this.app.route(`/users/:userId`)
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`Get to ${req.params.userId}`);
            })
            .put((req: express.Request, res: express.Response) => {
                res.status(200).send(`Put to ${req.params.userId}`);
            })
            .patch((req: express.Request, res: express.Response) => {
                res.status(200).send(`Patch to ${req.params.userId}`);
            })
            .delete((req: express.Request, res: express.Response) => {
                res.status(200).send(`Delete to ${req.params.userId}`);
            });
    }
}