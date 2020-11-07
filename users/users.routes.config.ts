import {CommonRoutesConfig} from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import express from 'express';

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes() {
        this.app.route(`/users`)
            .get(UsersController.listUsers)
            .post(UsersController.createUser);

        this.app.route(`/users/:userId`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                // This middleware function runs before any request to /users/:userId
                // It doesn't accomplish anything just yet---it simply passes control to the next applicable function below using next()
                next();
            })
            .get(UsersController.getUserById)
            .put(UsersController.put)
            .patch(UsersController.patch)
            .delete(UsersController.removeUser);

        return this.app;
    }
}