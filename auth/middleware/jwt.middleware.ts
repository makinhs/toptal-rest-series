import express from 'express';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// todo: remove-me
const jwtSecret = 'My!@!Se3cr8tH4sh3';

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

    validRefreshNeeded(req: any, res: express.Response, next: express.NextFunction) {
        let b = Buffer.from(req.body.refreshToken, 'base64');
        let refreshToken = b.toString();
        let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + jwtSecret).digest("base64");
        if (hash === refreshToken) {
            delete req.jwt.iat;
            delete req.jwt.exp;
            req.body = req.jwt;
            return next();
        } else {
            return res.status(400).send({error: 'Invalid refresh token'});
        }
    };


    validJWTNeeded(req: any, res: express.Response, next: express.NextFunction) {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    req.jwt = jwt.verify(authorization[1], jwtSecret);
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