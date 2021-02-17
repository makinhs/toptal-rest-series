import {CommonRoutesConfig} from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import UsersMiddleware from './middleware/users.middleware';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionLevel } from '../common/middleware/common.permissionlevel.enum';
import express from 'express';

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes():express.Application {
        this.app.route(`/users`)
            .get(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlyAdminCanDoThisAction,
                UsersController.listUsers)
            .post(
                UsersMiddleware.validateRequiredUserBodyFields,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createUser);

        this.app.param(`userId`, UsersMiddleware.extractUserId);
        this.app.route(`/users/:userId`)
            .all(UsersMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction)
            .get(UsersController.getUserById)
            .delete(UsersController.removeUser);

        this.app.put(`/users/:userId`,[
            jwtMiddleware.validJWTNeeded,
            UsersMiddleware.validateRequiredUserBodyFields,
            UsersMiddleware.validateSameEmailBelongToSameUser,
            UsersMiddleware.userCantChangePermission,
            permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            permissionMiddleware.minimumPermissionLevelRequired(PermissionLevel.PAID_PERMISSION),
            UsersController.put
        ]);


        /**
         * This route is currently not requiring extra permissions. Please update it for admin usage in your own application.
         */
        this.app.put(`/users/:userId/permissionLevel/:permissionLevel`, [
            jwtMiddleware.validJWTNeeded,
            permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            permissionMiddleware.minimumPermissionLevelRequired(PermissionLevel.FREE_PERMISSION),
            UsersController.updatePermissionLevel
        ])

        this.app.patch(`/users/:userId`, [
            jwtMiddleware.validJWTNeeded,
            UsersMiddleware.validatePatchEmail,
            permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            permissionMiddleware.minimumPermissionLevelRequired(PermissionLevel.PAID_PERMISSION),
            UsersController.patch
        ]);

        return this.app;
    }
}