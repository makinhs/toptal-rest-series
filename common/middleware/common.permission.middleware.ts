class CommonPermissionMiddleware {

    static FREE_PERMISSION = 1;
    static PAID_PERMISSION = 2;
    static ANOTHER_PAID_PERMISSION = 4;
    static ADMIN_PERMISSION = 1 + 2 + 4;
    static SUDO_PERMISSION = 2147483647;

    private static instance: CommonPermissionMiddleware;
    FREE_PERMISSION = CommonPermissionMiddleware.FREE_PERMISSION;
    PAID_PERMISSION = CommonPermissionMiddleware.PAID_PERMISSION;
    ANOTHER_PAID_PERMISSION = CommonPermissionMiddleware.ANOTHER_PAID_PERMISSION;
    SUDO_PERMISSION = CommonPermissionMiddleware.SUDO_PERMISSION;

    static getInstance() {
        if (!CommonPermissionMiddleware.instance) {
            CommonPermissionMiddleware.instance = new CommonPermissionMiddleware();
        }
        return CommonPermissionMiddleware.instance;
    }

    minimumPermissionLevelRequired(requiredPermissionLevel: any) {
        return (req: any, res: any, next: any) => {
            try {
                let userPermissionLevel = parseInt(req.jwt.permissionLevel);
                if (userPermissionLevel & Number.parseInt(requiredPermissionLevel)) {
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
            if (userPermissionLevel & CommonPermissionMiddleware.ADMIN_PERMISSION) {
                return next();
            } else {
                return res.status(403).send({});
            }
        }
    };

    async onlyAdminCanDoThisAction(req: any, res: any, next: any) {
        let userPermissionLevel = parseInt(req.jwt.permissionLevel);
        if (userPermissionLevel & CommonPermissionMiddleware.ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send({});
        }
    };

}

export default CommonPermissionMiddleware.getInstance();