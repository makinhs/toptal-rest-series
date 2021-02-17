import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Jwt } from '../../common/types/jwt';

// @ts-expect-error
const jwtSecret:string = process.env.JWT_SECRET;

class JwtMiddleware {
    private static instance: JwtMiddleware;

    static getInstance() {
        if (!JwtMiddleware.instance) {
            JwtMiddleware.instance = new JwtMiddleware();
        }
        return JwtMiddleware.instance;
    }

    verifyRefreshBodyField(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.refreshToken) {
            return next();
        } else {
            return res.status(400).send({error: 'need body field: refreshToken'});
        }
    };

    validRefreshNeeded(req: express.Request, res: express.Response, next: express.NextFunction) {
        const b = Buffer.from(req.body.refreshToken, 'base64');
        const refreshToken = b.toString();
        const hash = crypto.createHmac('sha512', res.locals.jwt.refreshKey).update(res.locals.jwt.userId + jwtSecret).digest("base64");
        if (hash === refreshToken) {
            req.body = {
                userId: res.locals.jwt.userId,
                email: res.locals.jwt.email,
                provider: res.locals.jwt.provider,
                permissionLevel: res.locals.jwt.permissionLevel,
            };
            return next();
        } else {
            return res.status(400).send({error: 'Invalid refresh token'});
        }
    };


    validJWTNeeded(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as Jwt;
                    next();
                }

            } catch (err) {
                return res.status(403).send();
            }
        } else {
            return res.status(401).send();
        }

    };
}

export default JwtMiddleware.getInstance();