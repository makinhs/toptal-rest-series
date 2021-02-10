import express from 'express';
import { PermissionLevel } from './common.permissionlevel.enum';
import debug from 'debug';

const log: debug.IDebugger = debug('app:common-permission-middleware');

class CommonPermissionMiddleware {


    private static instance: CommonPermissionMiddleware;

    static getInstance() {
        if (!CommonPermissionMiddleware.instance) {
            CommonPermissionMiddleware.instance = new CommonPermissionMiddleware();
        }
        return CommonPermissionMiddleware.instance;
    }

    minimumPermissionLevelRequired(requiredPermissionLevel: PermissionLevel) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                let userPermissionLevel = parseInt(req.jwt.permissionLevel);
                if (userPermissionLevel & requiredPermissionLevel) {
                    next();
                } else {
                    res.status(403).send({});
                }
            } catch (e) {
                log(e);
            }

        };
    };

    async onlySameUserOrAdminCanDoThisAction(req: express.Request, res: express.Response, next: express.NextFunction) {
        const userPermissionLevel = parseInt(req.jwt.permissionLevel);
        const userId = req.jwt.userId;
        if (req.params && req.params.userId && userId === req.params.userId) {
            return next();
        } else {
            if (userPermissionLevel & PermissionLevel.ADMIN_PERMISSION) {
                return next();
            } else {
                return res.status(403).send({});
            }
        }
    };

    async onlyAdminCanDoThisAction(req: express.Request, res: express.Response, next: express.NextFunction) {
        const userPermissionLevel = parseInt(req.jwt.permissionLevel);
        if (userPermissionLevel & PermissionLevel.ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send({});
        }
    };

}

export default CommonPermissionMiddleware.getInstance();