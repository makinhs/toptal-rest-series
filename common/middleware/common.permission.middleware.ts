import { PermissionLevel } from './common.permissionlevel.enum';
class CommonPermissionMiddleware {


    private static instance: CommonPermissionMiddleware;

    static getInstance() {
        if (!CommonPermissionMiddleware.instance) {
            CommonPermissionMiddleware.instance = new CommonPermissionMiddleware();
        }
        return CommonPermissionMiddleware.instance;
    }

    minimumPermissionLevelRequired(requiredPermissionLevel: PermissionLevel) {
        return (req: any, res: any, next: any) => {
            try {
                let userPermissionLevel = parseInt(req.jwt.permissionLevel);
                if (userPermissionLevel & requiredPermissionLevel) {
                    next();
                } else {
                    res.status(403).send({});
                }
            } catch (e) {
                console.log(e);
            }

        };
    };

    async onlySameUserOrAdminCanDoThisAction(req: any, res: any, next: any) {
        let userPermissionLevel = parseInt(req.jwt.permissionLevel);
        let userId = req.jwt.userId;
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

    async onlyAdminCanDoThisAction(req: any, res: any, next: any) {
        let userPermissionLevel = parseInt(req.jwt.permissionLevel);
        if (userPermissionLevel & PermissionLevel.ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send({});
        }
    };

}

export default CommonPermissionMiddleware.getInstance();